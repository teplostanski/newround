'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Modal } from '@heroui/react';
import { appVersion, buildInfo } from '@/shared/lib/build-info';
import { Routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import styles from './about-app.module.css';

type AboutAppProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const appName = 'newround';
const copyrightYear = new Date().getFullYear();

const AboutApp = ({ isOpen, onOpenChange }: AboutAppProps) => (
  <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Container placement="center">
      <Modal.Dialog className={styles.dialog}>
        <Modal.CloseTrigger />
        <Modal.Header className={styles.header}>
          <Image
            className={styles.icon}
            src="/pwa-192x192.png"
            alt="Логотип newround"
            width={72}
            height={72}
            unoptimized
          />
          <Modal.Heading className={styles.name}>{appName}</Modal.Heading>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <p className={styles.version}>Версия {appVersion}</p>

          {buildInfo ? (
            <p className={styles.meta}>
              Собрано из {' '}
              <a
                href={buildInfo.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {buildInfo.shortSha}
              </a>
            </p>
          ) : null}
          {buildInfo?.dateTime ? (
            <p className={styles.meta}>{buildInfo.dateTime}</p>
          ) : null}
          <p className={styles.lead}>Счётчик очков для настольных игр</p>
        </Modal.Body>
        <Modal.Footer className={styles.footer}>
          <Link
            className={styles.devLink}
            href={Routes.Dev}
            transitionTypes={routeTransitionTypes.forward}
            onClick={() => onOpenChange(false)}
          >
            Панель разработки
          </Link>
          <p className={styles.copyright}>
            © {copyrightYear} Игорь Теплостанский
          </p>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
);

export { AboutApp };
