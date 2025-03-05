import { Flex } from '@chakra-ui/react';
import { serviceSideProps } from '@fastgpt/web/common/system/nextjs';

const HcqPage = () => {
  return (
    <Flex flexDirection={'column'} h={'100%'}>
      <div>
        <p>HCQ</p>
      </div>
    </Flex>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content, ['app', 'user']))
    }
  };
}

export default HcqPage;
