import {Box, FormControl, FormHelperText, OutlinedInput, Stack, useTheme,} from '@mui/material'
import {memo, useContext, useMemo} from 'react'
import {css} from '@emotion/react'
import Title from './Title'
import {GgjOutlineButton} from '../GgjButton'
import {
  Action,
  DispatchContext,
  IsMaxFileContext,
  OptFileContext
} from './UploadImagesOrYoutubeContext'
import {Control, Controller, RegisterOptions, useForm} from 'react-hook-form'
import {ytRegExp} from 'common/variables'
import {useTranslation} from 'next-i18next'
import {nsTranUploadImages} from './index'
import {formatDate} from '../../../common/date'
import {toastHandler} from '../../../contexts/ToastContext'

interface IFormValues {
  youtubeLink: string
}

interface InputFormProps {
  control: Control<IFormValues>
  isError: boolean
  rules: RegisterOptions
  errorType: string
}

const InputForm = (props: InputFormProps) => {
  const theme = useTheme()
  const {t} = useTranslation(nsTranUploadImages)
  const {isError, rules, control, errorType} = props
  return (
    <FormControl variant="outlined" fullWidth error={isError} css={css` min-width: 200px;`}>
      <Controller
        control={control}
        name="youtubeLink"
        defaultValue=""
        aria-describedby="component-error-text"
        rules={rules}
        render={({field}) => {
          return (
            <OutlinedInput
              css={css`
                flex: 1;
                border-radius: 10px;
                background: #fff;
                border-color: ${theme.palette.smoke.dark};
                overflow: hidden;
              `}
              placeholder={'https://www.youtube.com/'}
              {...field}
            />
          )
        }}
      />
      {isError && <FormHelperText>{t(errorType)}</FormHelperText>}
    </FormControl>
  )
}

const UploadYoutubeLinks = () => {
  const theme = useTheme()
  const date=  formatDate(new Date(),'yyyy年MM月dd日')
  const {t} = useTranslation(nsTranUploadImages)
  const dispatch = useContext(DispatchContext)
  const isMaxFileContext = useContext(IsMaxFileContext)
  const {maxFiles} = useContext(OptFileContext)
  const {
    handleSubmit,
    control,
    resetField,
    formState: {errors},
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit',
  })

  const onSubmit = handleSubmit(async (data) => {
    const {youtubeLink} = data
    const filteredYTLink = youtubeLink.replace(/&list=[\w-]+/, '')
    const matchArray = filteredYTLink.match(ytRegExp)
    let thumbnailId
    if (matchArray && matchArray.length >= 1) {
      thumbnailId = matchArray[5]
      dispatch({
        type: Action.AddYoutube, payload: {
          youtubeLink,
          thumbnailId,
          maxFiles,
          date
        }
      })
    } else {
      toastHandler({message: t('not-ytlink-err'), type: 'error'})
    }

    resetField('youtubeLink')
  })

  const errorType = useMemo(() => {
    if (errors && errors.youtubeLink) {
      return errors.youtubeLink.type
    }
    return ''
  }, [errors])

  return (
    <Box css={css`margin-top: ${theme.spacing(4)}`}>
      <form onSubmit={onSubmit}>
        <Title>{t('5')}</Title>
        <Stack
          direction={{xs: 'column', md: 'row'}}
          spacing={{xs: 3, md: 4}}
          css={css`margin-top: 12px`}
          alignItems="center"
        >
          <InputForm
            errorType={errorType}
            control={control}
            isError={!!errors.youtubeLink}
            rules={{
              required: true
            }}
          />
          <GgjOutlineButton cssStr={'min-width:110px;'} type="submit"
            disabled={isMaxFileContext}>{t('6')}</GgjOutlineButton>
        </Stack>
      </form>
    </Box>
  )
}
export default memo(UploadYoutubeLinks)
