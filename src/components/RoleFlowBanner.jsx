import styles from '../styles/RoleFlowBanner.module.css';

const RoleFlowBanner = ({ eyebrow, title, description, steps = [], actions = [] }) => (
    <section className={styles.banner}>
        <div className={styles.copy}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.details}>
            <ol className={styles.steps}>
                {steps.map(step => (
                    <li key={step} className={styles.step}>
                        {step}
                    </li>
                ))}
            </ol>
            {actions.length > 0 && (
                <div className={styles.actions}>
                    {actions.map(action => (
                        <button
                            key={action.label}
                            type="button"
                            className={`btn ${action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </section>
);

export default RoleFlowBanner;
