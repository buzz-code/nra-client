import { JsonField, JsonInput } from "react-admin-json-view";

const reactJsonEditOptions = {
    name: null,
    style: {
        direction: 'ltr',
        textAlign: 'left',
    },
};
const reactJsonViewOptions = {
    ...reactJsonEditOptions,
    collapsed: true,
    collapseStringsAfterLength: 15,
    enableClipboard: false,
};

export const CommonJsonField = ({ source }) => (
    <JsonField source={source} reactJsonOptions={reactJsonViewOptions} />
);

export const CommonJsonInput = ({ source }) => (
    <JsonInput source={source} reactJsonOptions={reactJsonEditOptions} />
);
