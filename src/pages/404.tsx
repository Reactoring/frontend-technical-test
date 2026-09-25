import Head from 'next/head'
import { NotFoundState } from '../components/ui/NotFoundState/NotFoundState'
import { t } from '../i18n'

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>{t('app.pageTitle', { name: t('notFound.title') })}</title>
      </Head>
      <NotFoundState
        title={t('notFound.title')}
        message={t('notFound.message')}
        backLabel={t('conversation.back')}
        backHref="/"
      />
    </>
  )
}
