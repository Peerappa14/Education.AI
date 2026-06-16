-- Populate educational_resources with sample data for SSC, Programming, and Exams

INSERT INTO educational_resources (stream, category, resource_type, year, content, language) VALUES
-- SSLC (10th) Science
('SSLC', 'Science', 'NCERT_Notes', 2024, 'Periodic Table: Elements are arranged by atomic number. Groups are vertical columns, Periods are horizontal rows.', 'en'),
('SSLC', 'Science', 'NCERT_Notes', 2024, 'आवर्त सारणी: तत्वों को परमाणु क्रमांक के अनुसार व्यवस्थित किया जाता है।', 'hi'),
('SSLC', 'Science', 'NCERT_Notes', 2024, 'ಆವರ್ತಕ ಕೋಷ್ಟಕ: ಧಾತುಗಳನ್ನು ಪರಮಾಣು ಸಂಖ್ಯೆಯ ಆಧಾರದ ಮೇಲೆ ಜೋಡಿಸಲಾಗಿದೆ.', 'kn'),

-- SSLC (10th) Mathematics
('SSLC', 'Mathematics', 'PYQ', 2023, 'Quadratic Equations: A standard form is ax^2 + bx + c = 0. The roots are found using the formula (-b ± √(b^2 - 4ac)) / 2a.', 'en'),

-- Programming (Engineering)
('BE', 'Computer Science (CSE)', 'Notes', 2024, 'Python Variables: Variables are containers for storing data values. Unlike other languages, Python has no command for declaring a variable.', 'en'),
('BE', 'Computer Science (CSE)', 'Notes', 2024, 'Data Structures: A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations.', 'en'),

-- SSC/Competitive Exams
('Competitive', 'General Knowledge', 'Syllabus', 2024, 'SSC CGL Exam Pattern: Tier-1 has 100 questions (25 each for Reasoning, GA, Quant, English). Total 200 marks.', 'en'),
('Competitive', 'Aptitude', 'Shortcuts', 2024, 'Speed Math: To multiply any number by 5, divide it by 2 and add a zero at the end.', 'en');
