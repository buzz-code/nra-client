import { generalResourceFieldsTranslation } from '../providers/i18nProvider';

export const sharedEntityTranslations = {
  user: {
    name: 'משתמש |||| משתמשים',
    fields: {
      ...generalResourceFieldsTranslation,
      email: 'כתובת מייל',
      password: 'סיסמא',
      phoneNumber: 'מספר טלפון',
      userInfo: 'מידע על המשתמש',
      isPaid: 'האם שילם?',
      paymentMethod: 'אופן התשלום',
      mailAddressAlias: 'כתובת המייל ממנה יישלחו מיילים',
      mailAddressTitle: 'שם כתובת המייל',
      bccAddress: 'כתובת מייל לשליחת עותק',
      paymentTrackId: 'תוכנית',
      'additionalData.trialEndDate': 'תאריך חובת תשלום',
      'additionalData.customTrialMessage': 'הודעה מקדימה חובת תשלום',
      'additionalData.customTrialEndedMessage': 'הודעת סיום חובת תשלום',
    }
  },
  image: {
    name: 'תמונה |||| תמונות',
    fields: {
      ...generalResourceFieldsTranslation,
      fileData: 'תמונה',
      'fileData.src': 'תמונה',
      imageTarget: 'יעד',
    }
  },
  uploaded_file: {
    name: 'קבצים שהועלו',
    fields: {
      ...generalResourceFieldsTranslation,
      title: 'כותרת',
      description: 'תיאור',
      fileData: 'קובץ',
    }
  },
  audit_log: {
    name: 'נתונים שהשתנו',
    fields: {
      ...generalResourceFieldsTranslation,
      entityId: 'מזהה שורה',
      entityName: 'טבלה',
      operation: 'פעולה',
      entityData: 'המידע שהשתנה',
      isReverted: 'שוחזר',
    }
  },
  import_file: {
    name: 'קבצים שיובאו',
    fields: {
      ...generalResourceFieldsTranslation,
      fileName: 'שם הקובץ',
      fileSource: 'מקור הקובץ',
      'metadata.lessonTopic': 'נושא השיעור',
      'metadata.lessonStartTime': 'זמן תחילת השיעור',
      'metadata.lessonEndTime': 'זמן סיום השיעור',
      'metadata.signatureData': 'חתימה',
      entityIds: 'רשומות',
      entityName: 'סוג טבלה',
      fullSuccess: 'הצלחה',
      response: 'תגובה',
    }
  },
  mail_address: {
    name: 'כתובת מייל |||| כתובות מייל',
    fields: {
      ...generalResourceFieldsTranslation,
      alias: 'כתובת המייל',
      entity: 'טבלת יעד',
    }
  },
  page: {
    name: 'הסבר למשתמשים',
    fields: {
      ...generalResourceFieldsTranslation,
      description: 'כותרת',
      value: 'תוכן',
    }
  },
  text: {
    name: 'הודעה |||| הודעות - טבלת אדמין',
    fields: {
      ...generalResourceFieldsTranslation,
      description: 'תיאור',
      value: 'ערך',
    }
  },
  text_by_user: {
    name: 'הודעה |||| הודעות',
    fields: {
      ...generalResourceFieldsTranslation,
      description: 'תיאור',
      value: 'ערך',
    }
  },
  recieved_mail: {
    name: 'מיילים שהתקבלו',
    fields: {
      ...generalResourceFieldsTranslation,
      from: 'מאת',
      to: 'אל',
      subject: 'כותרת',
      body: 'תוכן',
      entityName: 'טבלת יעד',
      importFileIds: 'קבצים מצורפים',
    }
  },
  yemot_call: {
    name: 'שיחה |||| שיחות',
    fields: {
      ...generalResourceFieldsTranslation,
      phone: 'מאת',
      'phone:$cont': 'מאת',
      currentStep: 'שלב נוכחי',
      hasError: 'שגיאה?',
      errorMessage: 'הודעת שגיאה',
      'errorMessage:$cont': 'הודעת שגיאה',
      history: 'שלבים',
      data: 'נתונים',
      isOpen: 'פעיל?',
      apiCallId: 'מזהה שיחה (ימות)',
    }
  },
  payment_track: {
    name: 'מסלול תשלום |||| מסלולי תשלום',
    fields: {
      ...generalResourceFieldsTranslation,
      description: 'תיאור',
      monthlyPrice: 'מחיר חודשי',
      annualPrice: 'מחיר שנתי',
      studentNumberLimit: 'מספר תלמידות',
    }
  },
};
