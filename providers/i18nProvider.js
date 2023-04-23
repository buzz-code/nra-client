import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import he from 'ra-language-hebrew-il';
import { deepMerge } from '@shared/utils/deepMerge';

export const generalResourceFieldsTranslation = {
    id: 'מזהה',
    key: 'מפתח',
    name: 'שם',
    userId: 'משתמש',
    createdAt: 'תאריך יצירה',
    updatedAt: 'תאריך עדכון',
    'name:$cont': 'שם',
}

const extendedTranslation = {
    ra: {
        action: {
            create_item: 'צור %{item}',
            remove_all_filters: 'איפוס כל הפילטרים',
            select_all: 'בחירת הכל',
            select_row: 'בחירת רשומה',
            update: 'עדכון',
            move_up: 'העברה מעלה',
            move_down: 'העברה מטה',
            open: 'פתיחה',
            toggle_theme: 'החלפת ערכת נושא',
            select_columns: 'עמודות',
            import: 'ייבא',
            exportExcel: 'אקסל',
            exportPdf: 'pdf',
            hangup: 'נתק שיחה',
            show_matching_records: 'הצג רשומות קשורות',
        },
        auth: {
            sign_in_invitation: 'כבר יש לך חשבון? התחברות',
            sign_up_invitation: 'עדיין אין לך חשבון? הרשמה',
            sign_up: 'רישום',
            password_confirm: 'אימות סיסמא',
            userInfoHeader: 'מידע עליך',
            name: 'שם',
            role: 'תפקידך במוסד',
            phone: 'טלפון',
            email: 'כתובת מייל',
            organizationName: 'שם המוסד',
            organizationAddress: 'כתובת המוסד',
            organizationPhone: 'טלפון',
            userOrganizationInfoHeader: 'מידע על המוסד שלך',
        },
        message: {
            bulk_update_content: 'האם אתה בטוח שברצונך לעדכן %{name}? |||| האם אתה בטוח שברצונך לעדכן רשומות %{smart_count}?',
            bulk_update_title: 'עדכון %{name} |||| עדכון %{smart_count} %{name}',
            import_title: 'ייבוא רשומות',
            import_success: 'הייבוא הסתיים בהצלחה',
            report_generation_success: 'הקובץ הופק בהצלחה',
        },
        navigation: {
            partial_page_range_info: '%{offsetBegin}-%{offsetEnd} מתוך יותר מ %{offsetEnd}',
            current_page: 'עמוד %{page}',
            page: 'לעמוד %{page}',
            first: 'לעמוד הראשון',
            last: 'לעמוד האחרון',
            page_rows_per_page: 'מספר רשומות בעמוד:',
            skip_nav: 'דלג לתוכן',
        },
        notification: {
            not_authorized: "אין לך הרשאה לצפות בנתונים אלו.",
        },
        page: {
            empty: 'אין %{name} עדיין.',
            invite: 'האם ברצונך להוסיף?',
        },
        saved_queries: {
            label: 'שאילתות שנשמרו',
            query_name: 'שם שאילתה',
            new_label: 'שמור שאילתא נוכחית...',
            new_dialog_title: 'שמור שאילתא נוכחית בשם',
            remove_label: 'הסרת שאילתא',
            remove_label_with_name: 'הסרת שאילתא "%{name}"',
            remove_dialog_title: 'להסיר שאילתא שמורה?',
            remove_message: 'האם אתה בטוח שברצונך להסיר את השאילתה השמורה?',
            help: 'סנן את הרשימה ושמור את השאילתא',
        },
        configurable: {
            customize: 'התאמה אישית',
            configureMode: 'התאמה אישית של העמוד',
            inspector: {
                title: 'בחר',
                content: 'רחף על אלמנט כדי לבחור',
                reset: 'איפוס הגדרות',
            },
            SimpleList: {
                primaryText: 'טקסט ראשי',
                secondaryText: 'טקסט משני',
                tertiaryText: 'טקסט שלישי',
            },
        },
        validation: {
            valueConfirm: 'ערך לא תואם',
        },
    }
}

export const getI18nProvider = (domainTranslations) => {
    const translations = { en, he: deepMerge(he, deepMerge(extendedTranslation, domainTranslations)) };

    const i18nProvider = polyglotI18nProvider(
        locale => translations[locale],
        'he', // default locale
        [{ locale: 'en', name: 'English' }, { locale: 'he', name: 'עברית' }],
    );

    return i18nProvider;
}
