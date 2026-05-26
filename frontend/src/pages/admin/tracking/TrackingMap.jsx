import React from 'react';
import { STAGES } from './trackingConstants';
import styles from './TrackingMap.module.css';

export default function TrackingMap({ step }) {
  return (
    <div className={styles.container}>
      {STAGES.map((s, i) => (
        <React.Fragment key={s.step}>
          <div
            className={`${styles.stepIcon} ${step >= s.step ? styles.active : ''}`}
            style={{ '--step-color': s.color }}
          >
            <s.icon size={13} color={step >= s.step ? '#fff' : '#555'} />
          </div>
          {i < STAGES.length - 1 && (
            <div
              className={`${styles.stepLine} ${step > s.step ? styles.active : ''}`}
              style={{ '--step-color': s.color }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
