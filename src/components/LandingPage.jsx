import styles from '../styles/LandingPage.module.css';

const LandingPage = ({ onGetStarted, onBrowseKOLs, featuredKOLs = [] }) => {
    const momentumStats = [
        { value: '48 hrs', label: 'Average time to shortlist' },
        { value: '6.2%', label: 'Typical engagement benchmark' },
        { value: '64%', label: 'Repeat collaborations rate' }
    ];
    const momentumPoints = [
        'Share a brief and get curated creators with rates in one place.',
        'Compare portfolios, audience fit, and past results quickly.',
        'Keep teams aligned with clear status updates per campaign.'
    ];

    return (
        <div className={styles.landing}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>🇸🇬 #1 KOL Marketplace in Singapore</span>
                    <h1 className={styles.heroTitle}>
                        Connect with <span className={styles.gradient}>Top Influencers</span> in Singapore
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Find the perfect KOLs for your brand or showcase your influence to top businesses.
                        Join 500+ successful campaigns.
                    </p>
                    <div className={styles.heroCta}>
                        <button className="btn btn-primary btn-lg" onClick={onBrowseKOLs}>
                            Browse KOLs
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={onGetStarted}>
                            List Your Profile
                        </button>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>500+</span>
                            <span className={styles.statLabel}>Campaigns</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>50+</span>
                            <span className={styles.statLabel}>KOLs</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>98%</span>
                            <span className={styles.statLabel}>Success Rate</span>
                        </div>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.floatingCard}>
                        <div className={styles.cardPreview}>
                            <img
                                src="https://i.pravatar.cc/300?img=1"
                                alt="Featured KOL"
                                className={styles.previewPhoto}
                            />
                            <div className={styles.previewInfo}>
                                <span className={styles.previewName}>Jessica Tan</span>
                                <span className={styles.previewStats}>⭐ 4.9 · 47 campaigns</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.floatingCard2}>
                        <span className={styles.notification}>🎉 New campaign from Sephora!</span>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <p className={styles.sectionSubtitle}>Get started in 3 simple steps</p>

                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <div className={styles.stepIcon}>🔍</div>
                        <h3>Browse & Discover</h3>
                        <p>Search through our curated list of verified Singapore KOLs across all niches.</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepIcon}>📝</div>
                        <h3>Connect & Apply</h3>
                        <p>Apply to campaigns or contact KOLs directly. Submit your pitch and rates.</p>
                    </div>
                    <div className={styles.stepArrow}>→</div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepIcon}>🚀</div>
                        <h3>Collaborate & Grow</h3>
                        <p>Work together on amazing campaigns. Track results and build relationships.</p>
                    </div>
                </div>
            </section>

            {/* Featured KOLs */}
            {featuredKOLs.length > 0 && (
                <section className={styles.featured}>
                    <h2 className={styles.sectionTitle}>Featured KOLs</h2>
                    <p className={styles.sectionSubtitle}>Top-rated influencers ready to collaborate</p>

                    <div className={styles.featuredGrid}>
                        {featuredKOLs.slice(0, 4).map(kol => (
                            <div key={kol.id} className={styles.featuredCard}>
                                <img src={kol.profilePhoto} alt={kol.name} className={styles.featuredPhoto} />
                                <div className={styles.featuredInfo}>
                                    <h4>{kol.name}</h4>
                                    <p>{kol.tagline}</p>
                                    <div className={styles.featuredStats}>
                                        <span>⭐ {kol.rating}</span>
                                        <span>📊 {kol.campaignsCompleted} campaigns</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary" onClick={onBrowseKOLs}>
                        View All KOLs
                    </button>
                </section>
            )}

            {/* Momentum */}
            <section className={styles.momentum}>
                <div className={styles.momentumCopy}>
                    <h2 className={styles.sectionTitle}>Brand momentum, measured</h2>
                    <p className={styles.sectionSubtitle}>
                        Reach the right creators fast and build repeatable campaigns without the back-and-forth.
                    </p>
                    <ul className={styles.momentumList}>
                        {momentumPoints.map(point => (
                            <li key={point}>{point}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.momentumStats}>
                    {momentumStats.map(stat => (
                        <div key={stat.label} className={styles.momentumCard}>
                            <span className={styles.momentumValue}>{stat.value}</span>
                            <span className={styles.momentumLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* For Businesses & KOLs */}
            <section className={styles.forWho}>
                <div className={styles.forCard}>
                    <div className={styles.forIcon}>🏢</div>
                    <h3>For Businesses</h3>
                    <ul>
                        <li>✓ Browse verified SG influencers</li>
                        <li>✓ See real ratings & reviews</li>
                        <li>✓ Post campaign briefs</li>
                        <li>✓ Track campaign results</li>
                    </ul>
                    <button className="btn btn-primary" onClick={onBrowseKOLs}>
                        Find KOLs
                    </button>
                </div>
                <div className={styles.forCard}>
                    <div className={styles.forIcon}>⭐</div>
                    <h3>For KOLs</h3>
                    <ul>
                        <li>✓ Showcase your portfolio</li>
                        <li>✓ Get discovered by brands</li>
                        <li>✓ Apply to paid campaigns</li>
                        <li>✓ Build your reputation</li>
                    </ul>
                    <button className="btn btn-secondary" onClick={onGetStarted}>
                        Create Profile
                    </button>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <h2>Ready to get started?</h2>
                <p>Join Singapore's fastest-growing KOL marketplace today.</p>
                <div className={styles.ctaButtons}>
                    <button className="btn btn-primary btn-lg" onClick={onBrowseKOLs}>
                        Browse KOLs
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={onGetStarted}>
                        List Your Profile
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
