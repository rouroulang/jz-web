import {
    LoginFormPage,
    ProFormText,
} from '@ant-design/pro-components';
// import { Button, Space, message } from 'antd';
import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './index.less'

const Login = () => {
    return (
        <LoginFormPage
            title="账户登陆"
            subTitle="管理系统"
            backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
            backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
            containerStyle={{
                backgroundColor: 'rgba(0, 0, 0,0.65)',
                backdropFilter: 'blur(4px)',
            }}
        >
            <ProFormText
                name="username"
                fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                    {
                        required: true,
                        message: '请输入密码！',
                    },
                ]}
            />
        </LoginFormPage>
    )
}

export default Login;
