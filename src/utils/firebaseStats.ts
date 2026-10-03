/**
 * Firebase Realtime Database (RTDB) Stats & Quality Feedback Client
 *
 * Handles:
 * 1. Views tracking (debounced & deduplicated per session)
 * 2. Likes & Dislikes (atomic transactions with local caching)
 * 3. Structured Dislike Feedback (reasons + optional user notes)
 * 4. Graceful offline / unconfigured fallback (optimistic local state)
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  runTransaction,
  push,
  set,
  get,
  child,
  type Database
} from 'firebase/database';

// Read configuration from Vite / Astro environment variables
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL || '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '',
};

let dbInstance: Database | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(FIREBASE_CONFIG.databaseURL);
}

function getDb(): Database | null {
  if (dbInstance) return dbInstance;
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
    dbInstance = getDatabase(app);
    return dbInstance;
  } catch (err) {
    console.warn('[Wisdom Firebase] Initialization failed:', err);
    return null;
  }
}

// ── Local Storage Vote Cache (Tracks whether THIS browser liked/disliked) ──
const VOTES_STORAGE_KEY = 'wisdom_user_votes';
const SEEN_VIEWS_KEY = 'wisdom_seen_views_session';

export type VoteType = 'like' | 'dislike' | null;

export interface QuoteStats {
  views: number;
  likes: number;
  dislikes: number;
  shares?: number;
  shareTypes?: Record<string, number>;
  reasons?: Record<string, number>;
}

export interface DislikeFeedbackPayload {
  quoteId: string;
  reason: string;
  note?: string;
  timestamp?: number;
}

/**
 * Gets the current visitor's vote for a given quote ('like', 'dislike', or null).
 */
export function getLocalVote(quoteId: string): VoteType {
  try {
    const stored = JSON.parse(localStorage.getItem(VOTES_STORAGE_KEY) || '{}');
    return stored[quoteId] || null;
  } catch {
    return null;
  }
}

/**
 * Persists the visitor's vote in localStorage.
 */
function setLocalVote(quoteId: string, vote: VoteType) {
  try {
    const stored = JSON.parse(localStorage.getItem(VOTES_STORAGE_KEY) || '{}');
    if (vote) {
      stored[quoteId] = vote;
    } else {
      delete stored[quoteId];
    }
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

/**
 * Record a quote view (deduplicated per browser session).
 */
export async function recordQuoteView(quoteId: string): Promise<void> {
  if (!quoteId) return;

  // Deduplicate within current session
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_VIEWS_KEY) || '[]');
    if (seen.includes(quoteId)) return;
    seen.push(quoteId);
    sessionStorage.setItem(SEEN_VIEWS_KEY, JSON.stringify(seen));
  } catch {}

  const db = getDb();
  if (!db) return;

  try {
    const viewsRef = ref(db, `quotes/${quoteId}/views`);
    await runTransaction(viewsRef, (current) => (current || 0) + 1);
  } catch (err) {
    console.debug('[Wisdom Firebase] Failed to increment view:', err);
  }
}

/**
 * Record a quote share event (image share, link copy, image download, etc.).
 */
export async function recordQuoteShare(
  quoteId: string,
  shareType: 'image' | 'link' | 'download' | 'copy' = 'image'
): Promise<void> {
  if (!quoteId) return;

  const db = getDb();
  if (!db) {
    console.debug(`[Wisdom Firebase (local)] Quote shared: ${quoteId} (${shareType})`);
    return;
  }

  try {
    // 1. Increment total shares
    const sharesRef = ref(db, `quotes/${quoteId}/shares`);
    await runTransaction(sharesRef, (current) => (current || 0) + 1);

    // 2. Increment specific share type
    if (shareType) {
      const typeRef = ref(db, `quotes/${quoteId}/share_types/${shareType}`);
      await runTransaction(typeRef, (current) => (current || 0) + 1);
    }
  } catch (err) {
    console.debug('[Wisdom Firebase] Failed to record share:', err);
  }
}

/**
 * Record an author dossier view (deduplicated per browser session).
 */
const SEEN_AUTHORS_KEY = 'wisdom_seen_authors_session';

export async function recordAuthorDossierView(authorSlug: string, authorName?: string): Promise<void> {
  if (!authorSlug) return;

  // Deduplicate author views per session
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_AUTHORS_KEY) || '[]');
    if (seen.includes(authorSlug)) return;
    seen.push(authorSlug);
    sessionStorage.setItem(SEEN_AUTHORS_KEY, JSON.stringify(seen));
  } catch {}

  const db = getDb();
  if (!db) {
    console.debug(`[Wisdom Firebase (local)] Author dossier viewed: ${authorSlug}`);
    return;
  }

  try {
    const authorViewsRef = ref(db, `authors/${authorSlug}/dossierViews`);
    await runTransaction(authorViewsRef, (current) => (current || 0) + 1);

    if (authorName) {
      const nameRef = ref(db, `authors/${authorSlug}/name`);
      await set(nameRef, authorName);
    }

    const updatedRef = ref(db, `authors/${authorSlug}/updatedAt`);
    await set(updatedRef, Date.now());
  } catch (err) {
    console.debug('[Wisdom Firebase] Failed to record author dossier view:', err);
  }
}

/**
 * Cast or toggle a Like.
 * If user previously disliked, it automatically clears the dislike.
 */
export async function toggleQuoteLike(quoteId: string): Promise<{ isLiked: boolean }> {
  if (!quoteId) return { isLiked: false };

  const currentVote = getLocalVote(quoteId);
  const isCurrentlyLiked = currentVote === 'like';
  const isCurrentlyDisliked = currentVote === 'dislike';

  const newVote: VoteType = isCurrentlyLiked ? null : 'like';
  setLocalVote(quoteId, newVote);

  const db = getDb();
  if (db) {
    try {
      // 1. Update Likes count
      const likesRef = ref(db, `quotes/${quoteId}/likes`);
      await runTransaction(likesRef, (current) => Math.max(0, (current || 0) + (isCurrentlyLiked ? -1 : 1)));

      // 2. If previously disliked, remove that dislike count
      if (isCurrentlyDisliked) {
        const dislikesRef = ref(db, `quotes/${quoteId}/dislikes`);
        await runTransaction(dislikesRef, (current) => Math.max(0, (current || 0) - 1));
      }

      // Update timestamp
      const updatedRef = ref(db, `quotes/${quoteId}/updatedAt`);
      await set(updatedRef, Date.now());
    } catch (err) {
      console.warn('[Wisdom Firebase] Like transaction failed:', err);
    }
  }

  return { isLiked: newVote === 'like' };
}

/**
 * Cast or toggle a Dislike.
 * If user previously liked, it automatically clears the like.
 */
export async function toggleQuoteDislike(quoteId: string): Promise<{ isDisliked: boolean }> {
  if (!quoteId) return { isDisliked: false };

  const currentVote = getLocalVote(quoteId);
  const isCurrentlyDisliked = currentVote === 'dislike';
  const isCurrentlyLiked = currentVote === 'like';

  const newVote: VoteType = isCurrentlyDisliked ? null : 'dislike';
  setLocalVote(quoteId, newVote);

  const db = getDb();
  if (db) {
    try {
      // 1. Update Dislikes count
      const dislikesRef = ref(db, `quotes/${quoteId}/dislikes`);
      await runTransaction(dislikesRef, (current) => Math.max(0, (current || 0) + (isCurrentlyDisliked ? -1 : 1)));

      // 2. If previously liked, remove that like count
      if (isCurrentlyLiked) {
        const likesRef = ref(db, `quotes/${quoteId}/likes`);
        await runTransaction(likesRef, (current) => Math.max(0, (current || 0) - 1));
      }

      // Update timestamp
      const updatedRef = ref(db, `quotes/${quoteId}/updatedAt`);
      await set(updatedRef, Date.now());
    } catch (err) {
      console.warn('[Wisdom Firebase] Dislike transaction failed:', err);
    }
  }

  return { isDisliked: newVote === 'dislike' };
}

/**
 * Submit structured feedback for a disliked quote.
 * Increments reason tally and stores the comment for content quality review.
 */
export async function submitDislikeReason(payload: DislikeFeedbackPayload): Promise<boolean> {
  const { quoteId, reason, note = '' } = payload;
  if (!quoteId || !reason) return false;

  const db = getDb();
  if (!db) {
    console.info('[Wisdom Firebase (local)] Dislike feedback submitted:', payload);
    return true;
  }

  try {
    // 1. Increment reason counter under quotes/{quoteId}/dislike_reasons/{reason}
    const cleanReason = reason.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const reasonRef = ref(db, `quotes/${quoteId}/dislike_reasons/${cleanReason}`);
    await runTransaction(reasonRef, (current) => (current || 0) + 1);

    // 2. Append detailed feedback note under dislike_feedback/{quoteId}
    const feedbackListRef = ref(db, `dislike_feedback/${quoteId}`);
    const newFeedbackRef = push(feedbackListRef);
    await set(newFeedbackRef, {
      reason: cleanReason,
      note: note.trim(),
      timestamp: Date.now(),
    });

    return true;
  } catch (err) {
    console.warn('[Wisdom Firebase] Failed to submit dislike reason:', err);
    return false;
  }
}

/**
 * Fetch current stats for a quote from Firebase RTDB.
 */
export async function fetchQuoteStats(quoteId: string): Promise<QuoteStats | null> {
  const db = getDb();
  if (!db || !quoteId) return null;

  try {
    const snapshot = await get(child(ref(db), `quotes/${quoteId}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        views: data.views || 0,
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
        shares: data.shares || 0,
        shareTypes: data.share_types || {},
        reasons: data.dislike_reasons || {},
      };
    }
    return null;
  } catch (err) {
    console.debug('[Wisdom Firebase] Error fetching stats:', err);
    return null;
  }
}
