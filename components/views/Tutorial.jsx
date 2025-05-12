import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { apiUrl } from '@shared/providers/constantsProvider';

export default ({ }) => {
    return (
        <Container maxWidth="sm" mt={1}>
            <Paper>
                <Stack>
                    <Box padding={2}>
                        <Typography variant='h5'>
                            מדריך: חיבור המערכת הטלפונית שלכם (ימות המשיח)
                        </Typography>
                        <Typography variant='body1'>
                            כדי לחבר את המערכת הטלפונית שלכם למערכת שלנו, עקבו אחר הצעדים הבאים:
                            <br /><br />
                            <strong>שלב 1: כניסה לימות המשיח</strong>
                            <br />
                            1. היכנסו לאתר של ימות המשיח דרך הקישור הזה: <a href='https://www.call2all.co.il/yemot-admin-g1/#/IVR?filter={%22path%22:%22/%22}' target='_blank'>לחצו כאן</a>.
                            <br />
                            2. התחברו עם מספר הטלפון והסיסמה של המערכת הטלפונית שלכם.
                            <br /><br />
                            <strong>שלב 2: מעבר לניהול השלוחות</strong>
                            <br />
                            בתפריט הראשי באתר ימות המשיח, חפשו ולחצו על "השלוחות במערכת".
                            <br />
                            כאן תוכלו לראות את כל השלוחות שלכם.
                            <br /><br />
                            <strong>שלב 3: בחירת השלוחה לחיבור</strong>
                            <br />
                            עכשיו, חשוב להחליט מאיזו שלוחה השיחות יועברו למערכת שלנו:
                            <ul>
                                <li><strong>לחיבור מהקו הראשי:</strong> אם תרצו שכל שיחה שנכנסת למספר הראשי שלכם תעבור דרך המערכת שלנו, חפשו את הקובץ שנקרא <code>ext.ini</code> בתיקייה הראשית (התיקייה הראשית נקראת לפעמים "שורש" או מסומנת פשוט ב-<code>/</code>).</li>
                                <li><strong>לחיבור משלוחה ספציפית:</strong> אם תרצו שרק שיחות לשלוחה מסוימת (לדוגמה, שלוחה פנימית מספר 1, או 25) יעברו למערכת שלנו, היכנסו לתיקייה של אותה שלוחה ספציפית. בתוך התיקייה הזו, חפשו את הקובץ <code>ext.ini</code>.</li>
                            </ul>
                            <br />
                            <strong>שלב 4: עריכת קובץ ההגדרות (ext.ini)</strong>
                            <br />
                            1. אחרי שמצאתם את קובץ ה-<code>ext.ini</code> הנכון לפי ההסבר בשלב 3, לחצו עליו. ייפתח חלון לעריכת טקסט.
                            <br />
                            2. בחלון שנפתח, הדביקו את כל הטקסט הבא בדיוק כפי שהוא מופיע כאן למטה:
                            <br />
                            <pre dir='ltr'>
                                type=api
                                {'\r\n'}
                                api_link={apiUrl}/yemot/handle-call
                                {'\r\n'}
                                api_url_post=yes
                                {'\r\n'}
                                api_hangup_send=yes
                                {'\r\n'}
                                tts_voice=Sivan
                            </pre>
                            <br />
                            <strong>שלב 5: שמירת השינויים</strong>
                            <br />
                            לאחר שהדבקתם את הטקסט, לחצו על כפתור השמירה כדי לעדכן את הקובץ.
                            <br /><br />
                            זהו! אם עקבתם נכון אחר כל השלבים, המערכת הטלפונית שלכם מחוברת כעת למערכת שלנו.
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    )
}