import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useUserStore } from '@/web/support/user/useUserStore';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { ModelTypeEnum } from '@fastgpt/global/core/ai/model';
import { SystemModelItemType } from '@fastgpt/service/core/ai/type';
import MyBox from '@fastgpt/web/components/common/MyBox';
import MyMenu from '@fastgpt/web/components/common/MyMenu';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';
import { useRequest2 } from '@fastgpt/web/hooks/useRequest';
import {
  getSystemModelDetail,
  getSystemModelList,
  getTestModel,
  putSystemModel
} from '@/web/core/ai/config';
import { clientInitData } from '@/web/common/system/staticData';

const HcqModelTable = ({ Tab }: { Tab: React.ReactNode }) => {
  const { t } = useTranslation();
  const { userInfo } = useUserStore();
  const { defaultModels, feConfigs } = useSystemStore();

  const isRoot = userInfo?.username === 'root';

  const [editModelData, setEditModelData] = useState<SystemModelItemType>();

  const onCreateModel = (type: ModelTypeEnum) => {
    const defaultModel = defaultModels[type];

    setEditModelData({
      ...defaultModel,
      model: '',
      name: '',
      charsPointsPrice: 0,
      inputPrice: undefined,
      outputPrice: undefined,

      isCustom: true,
      isActive: true,
      // @ts-ignore
      type
    });
  };

  const {
    data: systemModelList = [],
    runAsync: refreshSystemModelList,
    loading: loadingModels
  } = useRequest2(getSystemModelList, {
    manual: false
  });

  const { runAsync: onEditModel, loading: loadingData } = useRequest2(
    (modelId: string) => getSystemModelDetail(modelId),
    {
      onSuccess: (data: SystemModelItemType) => {
        setEditModelData(data);
      }
    }
  );

  const refreshModels = useCallback(async () => {
    clientInitData();
    refreshSystemModelList();
  }, [refreshSystemModelList]);

  const { runAsync: onTestModel, loading: testingModel } = useRequest2(getTestModel, {
    manual: true,
    successToast: t('common:common.Success')
  });

  const { runAsync: updateModel, loading: updatingModel } = useRequest2(putSystemModel, {
    onSuccess: refreshModels
  });

  const isLoading = loadingModels || loadingData || updatingModel || testingModel;

  return (
    <>
      {isRoot && (
        <Flex alignItems={'center'}>
          {Tab}
          <Box flex={1} />
          <Button variant={'whiteBase'} mr={2} onClick={() => {}}>
            {t('account:model.default_model')}
          </Button>
          <Button variant={'whiteBase'} mr={2} onClick={() => {}}>
            {t('account:model.json_config')}
          </Button>
          <MyMenu
            trigger="hover"
            size="sm"
            Button={<Button>{t('account:create_model')}</Button>}
            menuList={[
              {
                children: [
                  {
                    label: t('common:model.type.chat'),
                    onClick: () => onCreateModel(ModelTypeEnum.llm)
                  },
                  {
                    label: t('common:model.type.embedding'),
                    onClick: () => onCreateModel(ModelTypeEnum.embedding)
                  },
                  {
                    label: t('common:model.type.tts'),
                    onClick: () => onCreateModel(ModelTypeEnum.tts)
                  },
                  {
                    label: t('common:model.type.stt'),
                    onClick: () => onCreateModel(ModelTypeEnum.stt)
                  },
                  {
                    label: t('common:model.type.reRank'),
                    onClick: () => onCreateModel(ModelTypeEnum.rerank)
                  }
                ]
              }
            ]}
          />
        </Flex>
      )}
      <MyBox flex={'1 0 0'} isLoading={isLoading}>
        <Flex flexDirection={'column'} h={'100%'}>
          <HStack flexShrink={0}>123</HStack>
        </Flex>
      </MyBox>
    </>
  );
};

export default HcqModelTable;
