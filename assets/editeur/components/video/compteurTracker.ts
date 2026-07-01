export interface CompteurTracker {
  shouldSend: () => boolean;
  markSent: () => void;
}

export function createCompteurTracker(): CompteurTracker {
  let sent = false;

  return {
    shouldSend: () => !sent,
    markSent: () => {
      sent = true;
    },
  };
}
