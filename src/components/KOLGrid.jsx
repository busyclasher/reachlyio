import KOLCard from './KOLCard';
import styles from '../styles/KOLGrid.module.css';

const KOLGrid = ({ kols, viewMode, onKOLClick, loading, favorites = [], onFavorite }) => {
    if (loading) {
        return (
            <div className={styles.grid}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.skeleton}>
                        <div className={styles.skeletonHeader}></div>
                        <div className={styles.skeletonBody}>
                            <div className={styles.skeletonCircle}></div>
                            <div className={styles.skeletonLine}></div>
                            <div className={styles.skeletonLine}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (kols.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No KOLs found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
            {kols.map((kol) => (
                <KOLCard
                    key={kol.id}
                    kol={kol}
                    viewMode={viewMode}
                    onClick={() => onKOLClick(kol)}
                    isFavorite={favorites.some(f => f.id === kol.id)}
                    onFavorite={onFavorite}
                />
            ))}
        </div>
    );
};

export default KOLGrid;
