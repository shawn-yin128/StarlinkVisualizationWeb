import {Button, Form, InputNumber} from "antd";

function SatelliteSettingForm(props) {
    const onFinish = values => {
        console.log('Received values of form: ', values);
        props.onShow(values);
    }

    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 11},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 13},
        },
    };

    return (
        <Form {...formItemLayout} className="sat-setting" onFinish={onFinish}>
            <Form.Item label="Longitude(degrees)" name="longitude" rules={[{required: true, message: "Please input your Longitude."}]}>
                <InputNumber min={-180} max={180} style={{width: "100%"}} placeholder={"Please input your Longitude."} />
            </Form.Item>

            <Form.Item label="Latitude(degrees)" name="latitude" rules={[{required: true, message: "Please input your Latitude."}]}>
                <InputNumber min={-90} max={90} style={{width: "100%"}} placeholder={"Please input your Latitude."} />
            </Form.Item>

            <Form.Item label="Elevations(meters)" name="elevation" rules={[{required: true, message: "Please input your Elevation."}]}>
                <InputNumber min={-413} max={8850} style={{width: "100%"}} placeholder={"Please input your Elevation."} />
            </Form.Item>

            <Form.Item label="Altitude(kilometers)" name="altitude" rules={[{required: true, message: "Please input your Altitude."}]}>
                <InputNumber min={0} max={500} style={{width: "100%"}} placeholder={"Please input your Altitude."} />
            </Form.Item>

            <Form.Item label="Duration(seconds)" name="duration" rules={[{required: true, message: "Please input your Duration."}]}>
                <InputNumber min={0} max={90} style={{width: "100%"}} placeholder={"Please input your Duration."} />
            </Form.Item>

            <Form.Item className="show-nearby">
                <Button type="primary" htmlType="submit" style={{textAlign: "center"}}>Find Nearby Satellite</Button>
            </Form.Item>
        </Form>
    );
}

export default SatelliteSettingForm;