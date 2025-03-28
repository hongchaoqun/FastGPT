import { Flex } from '@chakra-ui/react';
import { serviceSideProps } from '@fastgpt/web/common/system/nextjs';
import React from 'react';

const HcqAccountPage = () => {
  return (
    <Flex flexDirection={'column'} h={'100%'}>
      <div>
        <p>account</p>
      </div>
    </Flex>
  );
};

export default React.memo(HcqAccountPage);

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content, ['app', 'user']))
    }
  };
}
