import { useTranslation } from 'next-i18next';

import AccountContainer from '@/pageComponents/account/AccountContainer';
import { Box, BoxProps, Flex, useDisclosure, useTheme } from '@chakra-ui/react';
import { serviceSideProps } from '@fastgpt/web/common/system/nextjs';
import { useSystem } from '@fastgpt/web/hooks/useSystem';
import MyIcon from '@fastgpt/web/components/common/Icon';
import Avatar from '@fastgpt/web/components/common/Avatar';

import React from 'react';
import MyTooltip from '@fastgpt/web/components/common/MyTooltip';
import { useUserStore } from '@/web/support/user/useUserStore';
import { useSelectFile } from '@/web/common/file/hooks/useSelectFile';
import { useSystemStore } from '@/web/common/system/useSystemStore';

const HcqAccountInfoPage = () => {
  const { isPc } = useSystem();
  const { isOpen: isOpenContact, onClose: onCloseContact, onOpen: onOpenContact } = useDisclosure();

  return (
    <AccountContainer>
      <Box py={[3, '28px']} px={[5, 10]} mx={'auto'}>
        <Flex justifyContent={'center'} maxW={'1080px'}>
          <Box flex={'0 0 330px'}>
            <MyInfo onOpenContact={onOpenContact} />
          </Box>
        </Flex>
      </Box>
    </AccountContainer>
  );
};

export default React.memo(HcqAccountInfoPage);

const MyInfo = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const theme = useTheme();
  const { isPc } = useSystem();
  const { feConfigs } = useSystemStore();
  const { t } = useTranslation();
  const { userInfo, updateUserInfo, teamPlanStatus, initUserInfo } = useUserStore();

  const labelStyles: BoxProps = {
    flex: '0 0 80px',
    fontSize: 'sm',
    color: 'myGray.900'
  };

  const {
    File,
    onOpen: onOpenSelectFile,
    onSelectImage,
    loading
  } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });

  return (
    <>
      <Box>
        {/* user info */}
        {isPc && (
          <Flex alignItems={'center'} fontSize={'md'} h={'30px'}>
            <MyIcon mr={2} name={'support/user/userLight'} w={'1.25rem'} />
            个人信息
          </Flex>
        )}
        <Box mt={[0, 6]} fontSize={'sm'}>
          {isPc ? (
            <Flex alignItems={'center'} cursor={'pointer'}>
              <Box {...labelStyles}>{t('account_info:avatar')}:&nbsp;</Box>

              <MyTooltip label={t('account_info:select_avatar')}>
                <Box
                  w={['44px', '56px']}
                  h={['44px', '56px']}
                  borderRadius={'50%'}
                  border={theme.borders.base}
                  overflow={'hidden'}
                  p={'2px'}
                  boxShadow={'0 0 5px rgba(0,0,0,0.1)'}
                  mb={2}
                  onClick={() => onOpenSelectFile()}
                >
                  <Avatar src={userInfo?.avatar} borderRadius={'50%'} w={'100%'} h={'100%'} />
                </Box>
              </MyTooltip>
            </Flex>
          ) : (
            <Flex
              flexDirection={'column'}
              alignItems={'center'}
              cursor={'pointer'}
              onClick={() => onOpenSelectFile()}
            >
              <MyTooltip label={t('account_info:choose_avatar')}>
                <Box
                  w={['44px', '54px']}
                  h={['44px', '54px']}
                  borderRadius={'50%'}
                  border={theme.borders.base}
                  overflow={'hidden'}
                  p={'2px'}
                  boxShadow={'0 0 5px rgba(0,0,0,0.1)'}
                  mb={2}
                >
                  <Avatar src={userInfo?.avatar} borderRadius={'50%'} w={'100%'} h={'100%'} />
                </Box>
              </MyTooltip>

              <Flex alignItems={'center'} fontSize={'sm'} color={'myGray.600'}>
                <MyIcon mr={1} name={'edit'} w={'14px'} />
                {t('account_info:change')}
              </Flex>
            </Flex>
          )}
        </Box>
        <File
          onSelect={(e) =>
            onSelectImage(e, {
              maxW: 300,
              maxH: 300,
              callback: (src) => {
                if (!userInfo) return;
                // onclickSave({
                //   ...userInfo,
                //   avatar: src
                // });
                console.log(src);
              }
            })
          }
        />
      </Box>
    </>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content, ['app', 'user']))
    }
  };
}
