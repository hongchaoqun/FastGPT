import ModelTable from '@/components/core/ai/ModelTable';
import AccountContainer from '@/pageComponents/account/AccountContainer';
import { useUserStore } from '@/web/support/user/useUserStore';
import { Box, Flex } from '@chakra-ui/react';
import { serviceSideProps } from '@fastgpt/web/common/system/nextjs';
import FillRowTabs from '@fastgpt/web/components/common/Tabs/FillRowTabs';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

const ModelConfigTable = dynamic(
  () => import('@/pageComponents/hcq/account/model/HcqModelConfigTable')
);

type TabType = 'model' | 'config' | 'channel';

const HcqModelProvider = () => {
  const { t } = useTranslation();

  const [tab, setTab] = useState<TabType>('model');

  const Tab = useMemo(() => {
    return (
      <FillRowTabs<TabType>
        list={[
          { label: t('account:active_model'), value: 'model' },
          { label: t('account:config_model'), value: 'config' }
          // { label: t('account:channel'), value: 'channel' }
        ]}
        value={tab}
        py={1}
        onChange={setTab}
      />
    );
  }, [t, tab]);

  return (
    <AccountContainer>
      <Flex h={'100%'} flexDirection={'column'} gap={4} py={4} px={6}>
        {tab === 'model' && <ValidModelTable Tab={Tab} />}
        {tab === 'config' && <ModelConfigTable Tab={Tab} />}
      </Flex>
    </AccountContainer>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content, ['account']))
    }
  };
}

export default HcqModelProvider;

const ValidModelTable = ({ Tab }: { Tab: React.ReactNode }) => {
  const { userInfo } = useUserStore();
  const isRoot = userInfo?.username === 'root';
  return (
    <>
      {isRoot && <Flex justifyContent={'space-between'}>{Tab}</Flex>}
      <Box flex={'1 0 0'}>
        <ModelTable />
      </Box>
    </>
  );
};
