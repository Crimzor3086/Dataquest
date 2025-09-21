
export interface CourseData {
  id: string;
  title: string;
  price: number;
  instructor: string;
  duration: string;
  durationWeeks: number;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  syllabus: string[];
}

export const coursesData: CourseData[] = [
  {
    id: 'machine-learning-r',
    title: 'Machine Learning with R',
    price: 3500,
    instructor: 'Enock Bereka',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Comprehensive machine learning course using R programming language with practical applications and real-world projects.',
    category: 'Machine Learning',
    level: 'Intermediate',
    features: [
      'R Programming Fundamentals',
      'Supervised & Unsupervised Learning',
      'Model Evaluation & Tuning',
      'Ensemble Methods',
      'Real-world ML Projects'
    ],
    syllabus: [
      'Module 1: Introduction to Machine Learning',
      'Module 2: Data Preprocessing & Feature Engineering',
      'Module 3: Supervised Learning (Regression & Classification)',
      'Module 4: Unsupervised Learning (Clustering, PCA)',
      'Module 5: Model Evaluation & Tuning',
      'Module 6: Ensemble Learning (Random Forest, XGBoost)',
      'Module 7: Real-world ML Project in R',
      'Module 8: Model Deployment (Intro to R Shiny)'
    ]
  },
  {
    id: 'predictive-modeling-python',
    title: 'Predictive Modeling with Python',
    price: 3500,
    instructor: 'Timothy Achala',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Master predictive modeling techniques using Python with hands-on projects, real-world datasets, and model deployment.',
    category: 'Machine Learning',
    level: 'Advanced',
    features: [
      'Python Programming for Data Science',
      'Advanced Modeling Techniques',
      'Model Interpretation & Deployment',
      'Real-world Case Studies',
      'Streamlit Applications'
    ],
    syllabus: [
      'Module 1: Introduction to Predictive Modeling',
      'Module 2: Data Preparation & Feature Engineering',
      'Module 3: Regression Techniques',
      'Module 4: Classification Algorithms',
      'Module 5: Model Evaluation & Validation',
      'Module 6: Model Interpretation (SHAP, LIME)',
      'Module 7: Case Study: Health or Business Dataset',
      'Module 8: Model Deployment with Streamlit'
    ]
  },
  {
    id: 'statistical-modeling-stata',
    title: 'Statistical Analysis with Stata',
    price: 3200,
    instructor: 'Faith Chepkoech',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Comprehensive statistical analysis course using Stata for research and advanced data analysis with report writing.',
    category: 'Statistics',
    level: 'Advanced',
    features: [
      'Stata Programming & Interface',
      'Advanced Statistical Methods',
      'Panel & Time Series Analysis',
      'Professional Report Writing',
      'Research Applications'
    ],
    syllabus: [
      'Module 1: Introduction to Stata Interface & Commands',
      'Module 2: Data Management & Cleaning',
      'Module 3: Descriptive Statistics & Graphs',
      'Module 4: Hypothesis Testing (t-test, chi-square, ANOVA)',
      'Module 5: Regression Analysis',
      'Module 6: Panel & Time Series Basics',
      'Module 7: Logistic Regression & Survival Analysis',
      'Module 8: Report Writing in Stata'
    ]
  },
  {
    id: 'statistical-analysis-r',
    title: 'Statistical Analysis with R',
    price: 2800,
    instructor: 'Enock Bereka',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Complete statistical analysis course using R with data visualization, report automation, and real-world projects.',
    category: 'Statistics',
    level: 'Intermediate',
    features: [
      'R Programming & RStudio',
      'Statistical Testing & Analysis',
      'Data Visualization with ggplot2',
      'R Markdown Automation',
      'Practical Data Projects'
    ],
    syllabus: [
      'Module 1: Getting Started with R & RStudio',
      'Module 2: Data Import, Cleaning & Wrangling',
      'Module 3: Descriptive & Inferential Statistics',
      'Module 4: Correlation, t-tests, ANOVA',
      'Module 5: Linear & Logistic Regression',
      'Module 6: Data Visualization with ggplot2',
      'Module 7: Report Automation with R Markdown',
      'Module 8: Real-world Data Project'
    ]
  },
  {
    id: 'advanced-excel',
    title: 'Advanced Excel',
    price: 2700,
    instructor: 'Timothy Achala',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Master advanced Excel features including Power Query, Power Pivot, dashboard design, and automation with VBA.',
    category: 'Data Analysis',
    level: 'Intermediate',
    features: [
      'Advanced Formulas & Functions',
      'Power Query & Power Pivot',
      'Dashboard Design',
      'Data Validation & Analysis',
      'VBA & Macro Automation'
    ],
    syllabus: [
      'Module 1: Data Cleaning & Sorting Techniques',
      'Module 2: Advanced Formulas (INDEX, MATCH, IFs, etc.)',
      'Module 3: Pivot Tables & Charts',
      'Module 4: What-If Analysis & Data Validation',
      'Module 5: Power Query / Get & Transform',
      'Module 6: Power Pivot & DAX Basics',
      'Module 7: Dashboard Design',
      'Module 8: Automation with Macros & VBA (Intro)'
    ]
  },
  {
    id: 'statistical-analysis-spss',
    title: 'Statistical Analysis with SPSS',
    price: 2000,
    instructor: 'Nobert Wakasala',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Learn statistical analysis using SPSS for research and business applications with comprehensive data management and reporting.',
    category: 'Statistics',
    level: 'Beginner',
    features: [
      'SPSS Interface & Data Entry',
      'Comprehensive Statistical Testing',
      'Data Transformation & Cleaning',
      'Advanced Analysis Techniques',
      'Professional Report Export'
    ],
    syllabus: [
      'Module 1: SPSS Interface & Data Entry',
      'Module 2: Descriptive Statistics',
      'Module 3: Charts & Graphical Summaries',
      'Module 4: Hypothesis Testing (t-tests, ANOVA, chi-square)',
      'Module 5: Correlation & Regression',
      'Module 6: Factor & Cluster Analysis',
      'Module 7: Data Transformation & Cleaning',
      'Module 8: Report Export & Interpretation'
    ]
  },
  {
    id: 'data-collection-tools',
    title: 'Data Collection (Commcare, Kobo, ODK, Google Forms)',
    price: 4500,
    instructor: 'Nobert Wakasala',
    duration: '5 weeks',
    durationWeeks: 5,
    description: 'Master various data collection tools and platforms for field research and surveys.',
    category: 'Data Collection',
    level: 'Intermediate',
    features: [
      'Multiple Data Collection Platforms',
      'Survey Design Principles',
      'Mobile Data Collection',
      'Data Quality Assurance',
      'Integration and Export'
    ],
    syllabus: [
      'Introduction to Data Collection Tools',
      'Commcare Platform',
      'Kobo Toolbox and ODK',
      'Google Forms Advanced Features',
      'Data Integration and Analysis'
    ]
  },
  {
    id: 'data-analysis-r',
    title: 'Data Analysis with R',
    price: 2500,
    instructor: 'Enock Bereka',
    duration: '4 weeks',
    durationWeeks: 4,
    description: 'Learn comprehensive data analysis techniques using R programming language.',
    category: 'Data Analysis',
    level: 'Intermediate',
    features: [
      'R Programming Fundamentals',
      'Data Manipulation with dplyr',
      'Data Visualization with ggplot2',
      'Statistical Analysis',
      'Reporting with R Markdown'
    ],
    syllabus: [
      'R Programming Basics',
      'Data Manipulation and Cleaning',
      'Exploratory Data Analysis',
      'Statistical Analysis and Reporting'
    ]
  },
  {
    id: 'spatial-analysis',
    title: 'Spatial Analysis',
    price: 3000,
    instructor: 'Ogechi Koel',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Master spatial data analysis and GIS techniques with practical applications in epidemiology and public health.',
    category: 'Specialized Analysis',
    level: 'Advanced',
    features: [
      'Spatial Data Management',
      'GIS Software Proficiency',
      'Spatial Statistical Analysis',
      'Health Applications',
      'Professional Mapping'
    ],
    syllabus: [
      'Module 1: Introduction to Spatial Data',
      'Module 2: Coordinate Systems & Projections',
      'Module 3: Spatial Data Handling in R/QGIS',
      'Module 4: Mapping with ggmap, tmap, sf',
      'Module 5: Point Pattern Analysis',
      'Module 6: Raster Data Analysis',
      'Module 7: Spatial Regression & Interpolation',
      'Module 8: Project: Spatial Epidemiology or Public Health'
    ]
  },
  {
    id: 'time-series-analysis-r',
    title: 'Time Series Analysis with R',
    price: 2200,
    instructor: 'Enock Bereka',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Learn comprehensive time series analysis techniques for forecasting and trend analysis using R.',
    category: 'Specialized Analysis',
    level: 'Advanced',
    features: [
      'Time Series Fundamentals',
      'ARIMA & SARIMA Models',
      'Advanced Forecasting',
      'Seasonal Analysis',
      'Financial Time Series'
    ],
    syllabus: [
      'Module 1: Basics of Time Series Data',
      'Module 2: Visualization & Decomposition',
      'Module 3: Stationarity & Differencing',
      'Module 4: ARIMA, SARIMA Models',
      'Module 5: Forecasting & Model Evaluation',
      'Module 6: Seasonal Adjustment & Smoothing',
      'Module 7: Advanced: VAR & ARCH/GARCH Models',
      'Module 8: Practical Time Series Project'
    ]
  },
  {
    id: 'survival-analysis-r',
    title: 'Survival Analysis with R',
    price: 2000,
    instructor: 'Ogechi Koel',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Master survival analysis techniques for medical and epidemiological studies using R with practical applications.',
    category: 'Specialized Analysis',
    level: 'Advanced',
    features: [
      'Kaplan-Meier Estimation',
      'Cox Proportional Hazards',
      'Advanced Survival Models',
      'Medical Applications',
      'Epidemiological Analysis'
    ],
    syllabus: [
      'Module 1: Introduction to Survival Analysis',
      'Module 2: Kaplan-Meier Curves & Log-Rank Test',
      'Module 3: Cox Proportional Hazards Model',
      'Module 4: Assumptions & Diagnostics',
      'Module 5: Time-dependent Covariates',
      'Module 6: Parametric Survival Models',
      'Module 7: Visualizing Survival Data',
      'Module 8: Real-world Application in Epidemiology'
    ]
  },
  {
    id: 'qualitative-analysis-dedoose',
    title: 'Qualitative Analysis with Dedoose',
    price: 4000,
    instructor: 'Enock Bereka',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Comprehensive qualitative research methods and analysis using Dedoose software for mixed-methods research.',
    category: 'Research Methods',
    level: 'Intermediate',
    features: [
      'Dedoose Platform Mastery',
      'Advanced Coding Techniques',
      'Mixed-Methods Analysis',
      'Interrater Reliability',
      'Professional Reporting'
    ],
    syllabus: [
      'Module 1: Introduction to Dedoose & Setup',
      'Module 2: Data Import (Text, Audio, Video)',
      'Module 3: Coding & Codebook Development',
      'Module 4: Memo Writing & Excerpts',
      'Module 5: Code Co-occurrence & Analysis',
      'Module 6: Visualizations & Data Charts',
      'Module 7: Interrater Reliability',
      'Module 8: Exporting & Reporting Findings'
    ]
  },
  {
    id: 'power-bi-visualization',
    title: 'Data Visualization with Power BI',
    price: 2800,
    instructor: 'Timothy Achala',
    duration: '8 weeks',
    durationWeeks: 8,
    description: 'Master Power BI for creating interactive dashboards and reports with advanced data visualization techniques.',
    category: 'Data Visualization',
    level: 'Intermediate',
    features: [
      'Power BI Interface & Setup',
      'Advanced DAX Functions',
      'Interactive Dashboards',
      'Report Publishing & Sharing',
      'Real-world Projects'
    ],
    syllabus: [
      'Module 1: Introduction to Power BI Interface',
      'Module 2: Data Import & Power Query Editor',
      'Module 3: Building Reports & Dashboards',
      'Module 4: Visual Elements: Charts, Tables, Cards',
      'Module 5: DAX for Calculated Fields',
      'Module 6: Filters, Slicers, Drill-through',
      'Module 7: Publishing & Sharing Reports',
      'Module 8: Real-World Dashboard Project'
    ]
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    price: 2500,
    instructor: 'Nobert Wakasala',
    duration: '4 weeks',
    durationWeeks: 4,
    description: 'Learn professional graphic design principles and software tools.',
    category: 'Design',
    level: 'Beginner',
    features: [
      'Design Principles and Theory',
      'Adobe Creative Suite',
      'Logo and Brand Design',
      'Print and Digital Media',
      'Portfolio Development'
    ],
    syllabus: [
      'Design Fundamentals',
      'Adobe Photoshop and Illustrator',
      'Typography and Layout',
      'Portfolio Creation'
    ]
  }
];

export const getCourseById = (id: string): CourseData | undefined => {
  return coursesData.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): CourseData[] => {
  return coursesData.filter(course => course.category === category);
};

export const getCategories = (): string[] => {
  return Array.from(new Set(coursesData.map(course => course.category)));
};
