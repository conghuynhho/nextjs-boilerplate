import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
// import TopBanner from 'components/pages/index/TopBanner'
import GgjCommonHead from 'components/commons/GgjCommonHead'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'
import { IGgjSKillItem, nsGgjProductBox } from 'components/commons/GgjProductBox'
import { useLayoutContext } from 'contexts/LayoutContext'
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { BlankLayout } from 'components/layouts/BlankLayout'

const nsTran = 'surface@index'
export interface CustomContentProps {
  title: string
  id: number
  data: IGgjSKillItem[]
}
export const typeCheck = {
  custom_content: 'custom_content',
  ranking: 'ranking'
}

export default function IndexPage() {
  const { t } = useTranslation(nsTran)
  const {updateLayoutSetting} = useLayoutContext()
  const headData = useMemo(() => ({
    title: t('43'),
    description: t('44'),
    keywords: t('45'),
  }), [])

  useIsomorphicLayoutEffect(() => {
    updateLayoutSetting({ maxWidth: 1280 })
  }, [])

  return (
    <>
      <GgjCommonHead data={headData} />
      <GgjHiddenH1 />
      <h2>Hello</h2>
    </>
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const props = {
    props: {
      ...(await ggjServerSideTranslations(
        req as NextRequest,
        [nsTran, ...nsGgjProductBox],
      )),
    },
  }
  return { ...props }
}

IndexPage.Layout = BlankLayout
