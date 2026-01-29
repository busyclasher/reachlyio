import { useMemo, useState } from 'react';
import styles from '../styles/MessagesPage.module.css';

const MessagesPage = ({ threads, onSendMessage }) => {
  const [activeId, setActiveId] = useState(threads[0]?.id || null);
  const [draft, setDraft] = useState('');

  const resolvedActiveId = useMemo(() => {
    if (threads.some(thread => thread.id === activeId)) {
      return activeId;
    }
    return threads[0]?.id || null;
  }, [threads, activeId]);

  const activeThread = useMemo(
    () => threads.find(thread => thread.id === resolvedActiveId),
    [threads, resolvedActiveId]
  );

  if (!threads.length) {
    return (
      <div className={styles.empty}>
        <h2>No contact requests yet</h2>
        <p>Start outreach from any applicant profile or shortlist.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.list}>
        <h2>Contact requests</h2>
        {threads.map(thread => (
          <button
            type="button"
            key={thread.id}
            className={`${styles.thread} ${thread.id === resolvedActiveId ? styles.active : ''}`}
            onClick={() => setActiveId(thread.id)}
          >
            <div>
              <strong>{thread.applicant.name}</strong>
              <span>{thread.campaign.title}</span>
            </div>
            <span className={styles.status}>{thread.status}</span>
          </button>
        ))}
      </div>

      <div className={styles.threadDetail}>
        {activeThread ? (
          <>
            <div className={styles.threadHeader}>
              <div>
                <h3>{activeThread.applicant.name}</h3>
                <p>{activeThread.campaign.title} · {activeThread.applicant.pricingRange}</p>
              </div>
              <span className={styles.status}>{activeThread.status}</span>
            </div>
            <div className={styles.messageList}>
              {activeThread.messages.map(message => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'Business' ? styles.business : styles.applicant}`}
                >
                  <span className={styles.sender}>{message.sender}</span>
                  <p>{message.text}</p>
                  <span className={styles.time}>{message.timestamp}</span>
                </div>
              ))}
            </div>
            <form
              className={styles.composer}
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.trim()) return;
                onSendMessage(activeThread.id, draft.trim());
                setDraft('');
              }}
            >
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a message to the influencer..."
              />
              <button type="submit" className="btn btn-cta btn-sm">
                Send
              </button>
            </form>
          </>
        ) : (
          <p>Select a thread to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
