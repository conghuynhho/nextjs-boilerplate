import {useTranslation} from 'next-i18next'
import {nsTran} from './'

export default function LimitWarningText() {
  const { t } = useTranslation(nsTran)
  return <>{t('length-limit-error')}</>
}
