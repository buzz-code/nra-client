import { parseResponseLine, parseYemotResponse } from '../YemotSimulator';

describe('parseResponseLine', () => {
  it('returns empty array for a line with no messages', () => {
    expect(parseResponseLine('hangup=yes')).toEqual([]);
  });

  it('parses a single text message', () => {
    const result = parseResponseLine('id=t-hello');
    expect(result).toEqual([{ type: 'text', content: 'hello' }]);
  });

  it('parses multiple text messages in a single line', () => {
    const line = 'read=t-ירושלים.t-אוריה עוצר.t-רבי שמעיה הזקן';
    const result = parseResponseLine(line);
    expect(result).toEqual([
      { type: 'text', content: 'ירושלים' },
      { type: 'text', content: 'אוריה עוצר' },
      { type: 'text', content: 'רבי שמעיה הזקן' },
    ]);
  });

  it('parses a single file message', () => {
    const result = parseResponseLine('id=f-/path/audio');
    expect(result).toEqual([{ type: 'file', content: '/path/audio' }]);
  });

  it('parses mixed text and file messages', () => {
    const line = 'id=t-hello=f-/path/audio';
    const result = parseResponseLine(line);
    expect(result).toEqual([
      { type: 'text', content: 'hello' },
      { type: 'file', content: '/path/audio' },
    ]);
  });
});

describe('parseYemotResponse', () => {
  it('parses a simple text response', () => {
    const body = 'id=t-hello';
    const result = parseYemotResponse(body);
    expect(result.lines).toEqual([{ type: 'text', content: 'hello' }]);
    expect(result.param).toBe('');
    expect(result.hangup).toBe(false);
  });

  it('parses a read response with param and multiple text messages', () => {
    const body = 'read=t-ירושלים.t-אוריה עוצר.t-רבי שמעיה=val_1,no,1,1,7,No,no,no,,,,,None,';
    const result = parseYemotResponse(body);
    expect(result.lines).toEqual([
      { type: 'text', content: 'ירושלים' },
      { type: 'text', content: 'אוריה עוצר' },
      { type: 'text', content: 'רבי שמעיה' },
    ]);
    expect(result.param).toBe('val_1');
    expect(result.hangup).toBe(false);
  });

  it('parses the full multi-message D&D adventure response', () => {
    const body = 'read=t-ירושלים, שנת דתתנט שנת 1099 למניינם.t-אוריה עוצר ליד פתח בית הכנסת.t-רבי שמעיה הזקן יושב שם.t-מה שמעת?.t-לא שמעתי הרחתי.t-יפה ששמת לב.t-אז נרוץ לבדוק?.t-לא רצים לפני שחושבים.t-באותו זמן, בבית המדרש.t-בשולי הגמרא שלו מונח גרגר שחור.t-הוא מקרב את הנר אל הדף.t-יששכר סוגר את הגמרא.t-מישהו היה כאן.t-באותו זמן, בדרך העולה לירושלים.t-קרוב מאוד לשערי העיר.t-והסימן בבית המדרש?.t-השליח כבר השאיר אותו.t-וזה לא מסוכן?.t-מסוכן, אומר האיש.t-פגיעה בטהרה תסדוק את החותם העתיק.t-בירושלים, שלוש דמויות.t-עכשיו אתם נכנסים להרפתקה.t-חשבו רגע ביניכם.t-אם אחד מכם הוא רבי שמעיה.t-אם אחד מכם הוא אוריה.t-אם אחד מכם הוא יששכר.t-בחרו יחד הדמויות שלכם=val_1,no,1,1,7,No,no,no,,,,,None,';
    const result = parseYemotResponse(body);

    // Should have ~30 text messages, not just the first one
    expect(result.lines.length).toBeGreaterThan(20);
    expect(result.lines.every(line => line.type === 'text')).toBe(true);
    expect(result.lines[0].content).toBe('ירושלים, שנת דתתנט שנת 1099 למניינם');
    expect(result.param).toBe('val_1');
    expect(result.hangup).toBe(false);
  });

  it('parses the exact full D&D adventure response from the user report', () => {
    const body = 'read=t-ירושלים, שנת דתתנט שנת 1099 למניינם.t-אוריה עוצר ליד פתח בית הכנסת.t-רבי שמעיה הזקן יושב שם ואומר פרקי תהילים בלחש אוריה מכיר את רבי שמעיה בדרך כלל קול התפילה שלו שקט ורגוע, אבל הלילה המילים יוצאות קצרות יותר, דחופות יותר.t-רבי שמעיה, אומר אוריה, קרה משהו?.t-שמעיה פוקח את עיניו.t-מה שמעת?.t-לא שמעתי הרחתי אוריה מושך באפו יש ריח של עשן וברזל מן הדרך לא מהשוק, ולא מתנור של מאפייה.t-שמעיה מביט אל הסמטה החשוכה.t-יפה ששמת לב, הוא אומר מי שמכיר את הרחובות יודע לפעמים להרגיש שינוי קטן לפני כולם.t-אוריה מתקרב אליו.t-אז נרוץ לבדוק?.t-לא רצים לפני שחושבים, אומר שמעיה אבל גם לא מתעלמים מסימן ברור.t-באותו זמן, בבית המדרש שברובע היהודי, יששכר הנערלמדן נעצר באמצע הלימוד.t-בשולי הגמרא שלו מונח גרגר שחור, כמו אפר של קלף שרוף הוא לא היה שם קודם יששכר נוגע בו בקצה האצבע ומריח את אותו ריח מתכתי, כאילו מישהו הביא אל בית המדרש אבק מן הדרך.t-הוא מקרב את הנר אל הדף.t-ליד הגרגר יש סימן לחץ דק לא כתם סתם סימן של חפץ קטן וכבד שהונח על הגמרא, ואז הוסר במהירות לידו נשאר פירור שעווה כהה, כמו שעווה של חותם.t-יששכר סוגר את הגמרא בזהירות.t-מישהו היה כאן, הוא חושב לעצמו והוא לא חיפש ספר רגיל.t-באותו זמן, בדרך העולה לירושלים, ארבעה פרשים רוכבים אל העיר על סוסיהם השחורים הקבוצה אינה מניפה אף דגל שיכול לרמז מי הם ומאין הם באים במרכזם רוכב איש גלוח ראש בגלימה כהה על ברכיו מונח ספר כרוך בעור שחור, קשור ברצועה שחוקה.t-קרוב מאוד לשערי העיר, חבורת הפרשים עוצרת תחת עץ זית נמוך גלוח הראש מתיר את הקשר העוטף את הספר, ומדפדף עד דף שסומן בשריטה דקה.t-בקצה הדף דבוקה אותה שעווה כהה אחד הפרשים רוכן אליו.t-והסימן בבית המדרש?.t-השליח כבר השאיר אותו, אומר גלוח הראש מעט אפר, מעט שעווה, וסימן על הדף אם הנער הלמדן חד כמו שאמרו לנו, הוא יבין שמישהו נגע בספרו.t-וזה לא מסוכן?.t-מסוכן, אומר האיש אבל אנחנו צריכים שהוא יזוז מי שמנסה להגן על הטהרה, לפעמים מוביל אותנו בדיוק אל המקום שבו היא שמורה.t-בשולי הדף כתובה שורה קצרה:.t-פגיעה בטהרה תסדוק את החותם העתיק.t-בירושלים, שלוש דמויות מתחילות להבין שמשהו מתקרב אל העיר.t-אבל רק שתיים מהן יצעדו ראשונות אל תוך הסכנה.t-עכשיו אתם נכנסים להרפתקה.t-חשבו רגע ביניכם: איזו דמות תרצו לגלם במשחק? באיזו דרך תרצו לפתור את התעלומה?.t-אם אחד מכם הוא רבי שמעיה החכם והמיושב, והשני הוא יששכר הנער הלמדן, הקישו אחת.t-אם אחד מכם הוא אוריה, הילד הזריז שמכיר כל סמטה בירושלים, והשני הוא רבי שמעיה, הקישו שתיים.t-אם אחד מכם הוא יששכר הנער החד, שיודע לבדוק כל סימן, והשני הוא אוריה הנועז, שמוכן לרוץ בעקבות הרמזים, הקישו שלוש.t-בחרו יחד הדמויות שלכם יוצאות עכשיו אל הלילה הירושלמי, והתעלומה מתחילה=val_1,no,1,1,7,No,no,no,,,,,None,';
    const result = parseYemotResponse(body);

    // Every message must be parsed — not just the first one
    const expectedMessages = [
      'ירושלים, שנת דתתנט שנת 1099 למניינם',
      'אוריה עוצר ליד פתח בית הכנסת',
      'רבי שמעיה הזקן יושב שם ואומר פרקי תהילים בלחש אוריה מכיר את רבי שמעיה בדרך כלל קול התפילה שלו שקט ורגוע, אבל הלילה המילים יוצאות קצרות יותר, דחופות יותר',
      'רבי שמעיה, אומר אוריה, קרה משהו?',
      'שמעיה פוקח את עיניו',
      'מה שמעת?',
      'לא שמעתי הרחתי אוריה מושך באפו יש ריח של עשן וברזל מן הדרך לא מהשוק, ולא מתנור של מאפייה',
      'שמעיה מביט אל הסמטה החשוכה',
      'יפה ששמת לב, הוא אומר מי שמכיר את הרחובות יודע לפעמים להרגיש שינוי קטן לפני כולם',
      'אוריה מתקרב אליו',
      'אז נרוץ לבדוק?',
      'לא רצים לפני שחושבים, אומר שמעיה אבל גם לא מתעלמים מסימן ברור',
      'באותו זמן, בבית המדרש שברובע היהודי, יששכר הנערלמדן נעצר באמצע הלימוד',
      'בשולי הגמרא שלו מונח גרגר שחור, כמו אפר של קלף שרוף הוא לא היה שם קודם יששכר נוגע בו בקצה האצבע ומריח את אותו ריח מתכתי, כאילו מישהו הביא אל בית המדרש אבק מן הדרך',
      'הוא מקרב את הנר אל הדף',
      'ליד הגרגר יש סימן לחץ דק לא כתם סתם סימן של חפץ קטן וכבד שהונח על הגמרא, ואז הוסר במהירות לידו נשאר פירור שעווה כהה, כמו שעווה של חותם',
      'יששכר סוגר את הגמרא בזהירות',
      'מישהו היה כאן, הוא חושב לעצמו והוא לא חיפש ספר רגיל',
      'באותו זמן, בדרך העולה לירושלים, ארבעה פרשים רוכבים אל העיר על סוסיהם השחורים הקבוצה אינה מניפה אף דגל שיכול לרמז מי הם ומאין הם באים במרכזם רוכב איש גלוח ראש בגלימה כהה על ברכיו מונח ספר כרוך בעור שחור, קשור ברצועה שחוקה',
      'קרוב מאוד לשערי העיר, חבורת הפרשים עוצרת תחת עץ זית נמוך גלוח הראש מתיר את הקשר העוטף את הספר, ומדפדף עד דף שסומן בשריטה דקה',
      'בקצה הדף דבוקה אותה שעווה כהה אחד הפרשים רוכן אליו',
      'והסימן בבית המדרש?',
      'השליח כבר השאיר אותו, אומר גלוח הראש מעט אפר, מעט שעווה, וסימן על הדף אם הנער הלמדן חד כמו שאמרו לנו, הוא יבין שמישהו נגע בספרו',
      'וזה לא מסוכן?',
      'מסוכן, אומר האיש אבל אנחנו צריכים שהוא יזוז מי שמנסה להגן על הטהרה, לפעמים מוביל אותנו בדיוק אל המקום שבו היא שמורה',
      'בשולי הדף כתובה שורה קצרה:',
      'פגיעה בטהרה תסדוק את החותם העתיק',
      'בירושלים, שלוש דמויות מתחילות להבין שמשהו מתקרב אל העיר',
      'אבל רק שתיים מהן יצעדו ראשונות אל תוך הסכנה',
      'עכשיו אתם נכנסים להרפתקה',
      'חשבו רגע ביניכם: איזו דמות תרצו לגלם במשחק? באיזו דרך תרצו לפתור את התעלומה?',
      'אם אחד מכם הוא רבי שמעיה החכם והמיושב, והשני הוא יששכר הנער הלמדן, הקישו אחת',
      'אם אחד מכם הוא אוריה, הילד הזריז שמכיר כל סמטה בירושלים, והשני הוא רבי שמעיה, הקישו שתיים',
      'אם אחד מכם הוא יששכר הנער החד, שיודע לבדוק כל סימן, והשני הוא אוריה הנועז, שמוכן לרוץ בעקבות הרמזים, הקישו שלוש',
      'בחרו יחד הדמויות שלכם יוצאות עכשיו אל הלילה הירושלמי, והתעלומה מתחילה',
    ];

    expect(result.lines.length).toBe(expectedMessages.length);
    expect(result.lines.every(line => line.type === 'text')).toBe(true);
    result.lines.forEach((line, i) => {
      expect(line.content).toBe(expectedMessages[i]);
    });
    expect(result.param).toBe('val_1');
    expect(result.hangup).toBe(false);
  });

  it('detects hangup', () => {
    const body = 'hangup=yes';
    const result = parseYemotResponse(body);
    expect(result.hangup).toBe(true);
    expect(result.lines).toEqual([]);
  });

  it('parses multiple &-delimited lines', () => {
    const body = 'id=t-hello&read=t-world=val_1,no,';
    const result = parseYemotResponse(body);
    expect(result.lines).toEqual([
      { type: 'text', content: 'hello' },
      { type: 'text', content: 'world' },
    ]);
    expect(result.param).toBe('val_1');
  });

  it('resolves the param correctly when message text contains embedded "=" (e.g. [[KEY=VALUE]] markup)', () => {
    const body = 'read=t-[[SEGMENT_ID=SEG_3B]].t-[[TITLE=רמה 3  מקטע ב2  בית הכנסת החורבה]].t-דלת בית הכנסת החורבה פתוחה=val_3,no,1,1,7,No,no,no,,,,,None,';
    const result = parseYemotResponse(body);
    expect(result.lines).toEqual([
      { type: 'text', content: '[[SEGMENT_ID=SEG_3B]]' },
      { type: 'text', content: '[[TITLE=רמה 3  מקטע ב2  בית הכנסת החורבה]]' },
      { type: 'text', content: 'דלת בית הכנסת החורבה פתוחה' },
    ]);
    expect(result.param).toBe('val_3');
    expect(result.hangup).toBe(false);
  });
});