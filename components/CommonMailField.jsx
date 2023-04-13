import { EmailField, useRecordContext } from "react-admin"

export const CommonMailField = ({source, domain = 'yoman.online'}) =>{
    const record = useRecordContext();

    if(!record || !record[source]){
        return null;
    }

    const emailAddress = `${record[source]}@${domain}`;
    record.emailAddress111 = emailAddress;
    return (
        <EmailField source="emailAddress111" />
    )
}
