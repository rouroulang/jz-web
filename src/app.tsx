import { isMobile } from './utils/isMobile';
import {
  Dropdown,
} from 'antd';
import {
  LogoutOutlined,
} from '@ant-design/icons';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string, isMobile: boolean }> {
  return { name: '', isMobile: isMobile() };
}

export const layout = (a) => {
  return {
    logo: null,
    menu: {
      locale: false,
    },
    menuFooterRender: false,
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      size: 'small',
      title: '七妮妮',
      render: (props, dom) => {
        console.log(a)
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        );
      },
    },
    fixSiderbar: true,
    layout: 'top',
    splitMenus: true,
    headerTitleRender: (logo, title, _) => {
      const defaultDom = (
        <a
          onClick={() => {
            console.log('titheaderTitle clicked');
          }}
        >
          {logo}
          {title}
        </a>
      );
      // if (_.isMobile) return defaultDom;
      return (
        <>
          {defaultDom}
        </>
      );
    }
  };
};

// export const layout = () => null
