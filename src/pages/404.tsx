import { NotFoundState } from '../components/ui/NotFoundState/NotFoundState'
import { t } from '../i18n'

export default function NotFoundPage() {
  return (
    <NotFoundState
      title={t('notFound.title')}
      message={t('notFound.message')}
      backLabel={t('conversation.back')}
      backHref="/"
    />
  )
}
