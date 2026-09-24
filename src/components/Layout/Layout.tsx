import type { ReactNode } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '../../assets/lbc-logo.webp'
import { t } from '../../i18n'
import styles from './Layout.module.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
        <meta name="description" content={t('app.description')} />
      </Head>

      <header className={styles.header}>
        <Image src={Logo} alt="leboncoin" height={32} priority />
        <span className={styles.badge}>{t('app.title')}</span>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  )
}
