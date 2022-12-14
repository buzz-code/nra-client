import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import he from 'ra-language-hebrew-il';
import { deepMerge } from '../utils/deepMerge';

export const generalResourceFieldsTranslation = {
    id: 'מזהה',
    key: 'מפתח',
    name: 'שם',
    userId: 'משתמש',
    createdAt: 'תאריך יצירה',
    updatedAt: 'תאריך עדכון',
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
        },
        message: {
            bulk_update_content: 'האם אתה בטוח שברצונך לעדכן %{name}? |||| האם אתה בטוח שברצונך לעדכן רשומות %{smart_count}?',
            bulk_update_title: 'עדכון %{name} |||| עדכון %{smart_count} %{name}',
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
