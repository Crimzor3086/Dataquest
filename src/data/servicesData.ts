
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  features: string[];
  pricing: {
    startingPrice: string;
    packages: {
      name: string;
      price: string;
      features: string[];
    }[];
  };
  deliverables: string[];
  timeline: string;
  category: string;
}

export const servicesData: ServiceData[] = [
  {
    id: 'statistical-analysis',
    title: 'Statistical Analysis',
    description: 'Comprehensive statistical analysis services including descriptive, inferential statistics, and hypothesis testing.',
    detailedDescription: 'Expert statistical analysis services using industry-standard tools to provide robust data insights for research, business, and academic purposes.',
    features: [
      'Descriptive and inferential statistics',
      'Hypothesis testing (t-tests, chi-square, ANOVA)',
      'Regression and multivariate analysis',
      'Software: SPSS, Stata, R, Python',
      'Custom statistical reports',
      'Data interpretation and recommendations'
    ],
    pricing: {
      startingPrice: 'KES 3,000',
      packages: [
        {
          name: 'Basic Analysis',
          price: 'KES 3,000 - 5,000',
          features: ['Descriptive statistics', 'Basic hypothesis testing', 'Summary report']
        },
        {
          name: 'Advanced Analysis',
          price: 'KES 6,000 - 10,000',
          features: ['Complex statistical models', 'Multivariate analysis', 'Detailed interpretation', 'Visual reports']
        },
        {
          name: 'Comprehensive Package',
          price: 'KES 12,000 - 20,000',
          features: ['Full statistical consultation', 'Multiple analysis methods', 'Publication-ready reports', 'Ongoing support']
        }
      ]
    },
    deliverables: ['Statistical analysis report', 'Data visualizations', 'Methodology documentation', 'Results interpretation'],
    timeline: '1-3 weeks',
    category: 'Statistics'
  },
  {
    id: 'time-series-analysis',
    title: 'Time Series Analysis',
    description: 'Advanced time series modeling for trend analysis, seasonality detection, and accurate forecasting.',
    detailedDescription: 'Specialized time series analysis services using cutting-edge techniques for forecasting and temporal data modeling across various industries.',
    features: [
      'Trend, seasonality, and forecasting techniques',
      'ARIMA, SARIMA, Exponential Smoothing',
      'Stationarity testing and model evaluation',
      'Tools: R (forecast, prophet), Python (statsmodels, pmdarima)',
      'Business forecasting and planning',
      'Model validation and diagnostics'
    ],
    pricing: {
      startingPrice: 'KES 4,000',
      packages: [
        {
          name: 'Basic Forecasting',
          price: 'KES 4,000 - 6,000',
          features: ['Simple trend analysis', 'Basic forecasting models', 'Seasonal decomposition']
        },
        {
          name: 'Advanced Modeling',
          price: 'KES 7,000 - 12,000',
          features: ['ARIMA/SARIMA models', 'Multiple forecasting methods', 'Model comparison', 'Detailed reports']
        },
        {
          name: 'Enterprise Solution',
          price: 'KES 15,000 - 25,000',
          features: ['Complex multi-series models', 'Real-time forecasting', 'Custom dashboards', 'Ongoing model updates']
        }
      ]
    },
    deliverables: ['Forecasting models', 'Trend analysis reports', 'Prediction intervals', 'Model documentation'],
    timeline: '2-4 weeks',
    category: 'Advanced Analytics'
  },
  {
    id: 'survival-analysis',
    title: 'Survival Analysis',
    description: 'Specialized survival analysis for medical research, clinical trials, and time-to-event studies.',
    detailedDescription: 'Expert survival analysis services for healthcare, research, and business applications using advanced statistical methods and visualization techniques.',
    features: [
      'Kaplan-Meier estimates & Cox regression',
      'Survival curves and hazard ratios',
      'Parametric survival models',
      'Tools: R (survival, survminer), Python (lifelines)',
      'Clinical trial analysis',
      'Risk factor identification'
    ],
    pricing: {
      startingPrice: 'KES 5,000',
      packages: [
        {
          name: 'Basic Survival Analysis',
          price: 'KES 5,000 - 8,000',
          features: ['Kaplan-Meier curves', 'Log-rank tests', 'Basic Cox regression']
        },
        {
          name: 'Advanced Analysis',
          price: 'KES 10,000 - 15,000',
          features: ['Complex Cox models', 'Parametric models', 'Time-dependent covariates', 'Detailed reports']
        },
        {
          name: 'Clinical Research Package',
          price: 'KES 18,000 - 30,000',
          features: ['Multi-center analysis', 'Publication support', 'Regulatory compliance', 'Comprehensive documentation']
        }
      ]
    },
    deliverables: ['Survival curves', 'Hazard ratio calculations', 'Statistical reports', 'Clinical interpretations'],
    timeline: '2-5 weeks',
    category: 'Medical Statistics'
  },
  {
    id: 'spatial-gis-analysis',
    title: 'Spatial & GIS Analysis',
    description: 'Comprehensive spatial data analysis, mapping, and geographic information systems services.',
    detailedDescription: 'Advanced spatial analysis services for geographic data modeling, mapping, and location-based insights using professional GIS tools.',
    features: [
      'Spatial data modeling and mapping',
      'Hotspot and cluster analysis',
      'Shapefile handling and geocoding',
      'Tools: QGIS, ArcGIS, R (sf, tmap), Python (folium, geopandas)',
      'Geographic visualization',
      'Spatial statistics and modeling'
    ],
    pricing: {
      startingPrice: 'KES 6,000',
      packages: [
        {
          name: 'Basic Mapping',
          price: 'KES 6,000 - 10,000',
          features: ['Simple maps', 'Basic spatial analysis', 'Data visualization']
        },
        {
          name: 'Advanced GIS',
          price: 'KES 12,000 - 20,000',
          features: ['Complex spatial modeling', 'Hotspot analysis', 'Multi-layer analysis', 'Interactive maps']
        },
        {
          name: 'Professional GIS Solution',
          price: 'KES 25,000 - 40,000',
          features: ['Enterprise GIS setup', 'Custom applications', 'Training included', 'Ongoing support']
        }
      ]
    },
    deliverables: ['Interactive maps', 'Spatial analysis reports', 'GIS databases', 'Visualization dashboards'],
    timeline: '2-8 weeks',
    category: 'GIS & Mapping'
  },
  {
    id: 'data-collection-services',
    title: 'Data Collection Services',
    description: 'Professional data collection solutions including questionnaire design and digital survey tools.',
    detailedDescription: 'Comprehensive data collection services from survey design to field implementation using modern digital tools and best practices.',
    features: [
      'Questionnaire design and digital data tools',
      'Kobo Toolbox, ODK, Commcare, REDCap',
      'Sampling techniques and field support',
      'Data entry, validation, and cleaning workflows',
      'Mobile data collection',
      'Quality assurance protocols'
    ],
    pricing: {
      startingPrice: 'KES 5,000',
      packages: [
        {
          name: 'Survey Design',
          price: 'KES 5,000 - 8,000',
          features: ['Questionnaire design', 'Digital form setup', 'Basic training']
        },
        {
          name: 'Full Data Collection',
          price: 'KES 12,000 - 25,000',
          features: ['Complete survey implementation', 'Field supervision', 'Data cleaning', 'Quality control']
        },
        {
          name: 'Enterprise Collection',
          price: 'KES 30,000 - 50,000',
          features: ['Large-scale surveys', 'Multi-site coordination', 'Real-time monitoring', 'Advanced analytics']
        }
      ]
    },
    deliverables: ['Survey instruments', 'Clean datasets', 'Field reports', 'Data collection protocols'],
    timeline: '2-12 weeks',
    category: 'Data Collection'
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Advanced machine learning solutions for classification, regression, and clustering applications.',
    detailedDescription: 'Custom machine learning models and solutions for business intelligence, predictive analytics, and automated decision-making.',
    features: [
      'Classification, regression, and clustering models',
      'Feature engineering and model evaluation',
      'Tools: Python (scikit-learn, pandas), R',
      'Use cases in healthcare, business, research',
      'Model deployment and monitoring',
      'Performance optimization'
    ],
    pricing: {
      startingPrice: 'KES 8,000',
      packages: [
        {
          name: 'Basic ML Model',
          price: 'KES 8,000 - 12,000',
          features: ['Simple ML models', 'Basic feature engineering', 'Model evaluation']
        },
        {
          name: 'Advanced ML Solution',
          price: 'KES 15,000 - 25,000',
          features: ['Complex algorithms', 'Advanced feature engineering', 'Model optimization', 'Deployment guide']
        },
        {
          name: 'Enterprise ML Platform',
          price: 'KES 30,000 - 50,000',
          features: ['End-to-end ML pipeline', 'Real-time deployment', 'Monitoring systems', 'Ongoing support']
        }
      ]
    },
    deliverables: ['Trained models', 'Performance metrics', 'Deployment package', 'Documentation'],
    timeline: '3-10 weeks',
    category: 'AI/ML'
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Cutting-edge deep learning solutions for neural networks, image processing, and AI applications.',
    detailedDescription: 'Advanced deep learning services for complex pattern recognition, computer vision, and natural language processing applications.',
    features: [
      'Neural networks (CNNs, RNNs, DNNs)',
      'Image and text data modeling',
      'Tools: TensorFlow, Keras, PyTorch',
      'Use cases: health diagnostics, NLP, AI solutions',
      'Computer vision applications',
      'Natural language processing'
    ],
    pricing: {
      startingPrice: 'KES 12,000',
      packages: [
        {
          name: 'Basic Deep Learning',
          price: 'KES 12,000 - 18,000',
          features: ['Simple neural networks', 'Basic training', 'Performance evaluation']
        },
        {
          name: 'Advanced DL Solution',
          price: 'KES 20,000 - 35,000',
          features: ['Complex architectures', 'Transfer learning', 'Custom datasets', 'Advanced optimization']
        },
        {
          name: 'Enterprise AI Solution',
          price: 'KES 40,000 - 70,000',
          features: ['Production-ready models', 'Scalable deployment', 'Continuous learning', 'Full AI pipeline']
        }
      ]
    },
    deliverables: ['Deep learning models', 'Architecture documentation', 'Performance reports', 'Deployment scripts'],
    timeline: '4-16 weeks',
    category: 'AI/ML'
  },
  {
    id: 'research-writing',
    title: 'Research Writing & Proposal Development',
    description: 'Professional research writing, proposal development, and academic publication support services.',
    detailedDescription: 'Comprehensive research writing services including literature reviews, methodology development, and publication support for academic and professional purposes.',
    features: [
      'Literature review, methodology, and results interpretation',
      'Scientific report formatting and referencing styles (APA, MLA)',
      'Plagiarism checking and editing support',
      'Journal submissions, thesis, and grant proposals',
      'Academic writing guidance',
      'Publication strategy consulting'
    ],
    pricing: {
      startingPrice: 'KES 4,000',
      packages: [
        {
          name: 'Basic Writing Support',
          price: 'KES 4,000 - 8,000',
          features: ['Document review', 'Basic editing', 'Formatting assistance']
        },
        {
          name: 'Research Paper Package',
          price: 'KES 10,000 - 20,000',
          features: ['Literature review', 'Methodology development', 'Results interpretation', 'Full manuscript preparation']
        },
        {
          name: 'Publication Support',
          price: 'KES 25,000 - 40,000',
          features: ['Grant proposal writing', 'Journal submission support', 'Peer review assistance', 'Publication strategy']
        }
      ]
    },
    deliverables: ['Research manuscripts', 'Literature reviews', 'Grant proposals', 'Publication-ready documents'],
    timeline: '2-8 weeks',
    category: 'Research & Writing'
  },
  {
    id: 'outbreak-investigation',
    title: 'Outbreak Disease Investigation',
    description: 'Specialized epidemiological investigation services for disease outbreak management and public health response.',
    detailedDescription: 'Expert outbreak investigation services including surveillance, case definitions, contact tracing, and public health reporting for disease control and prevention.',
    features: [
      'Epidemiological surveillance and case definitions',
      'Line listing, epidemic curve analysis, contact tracing',
      'Rapid field data collection and public health reporting',
      'Tools: Epi Info, WHO templates',
      'Risk assessment and modeling',
      'Public health recommendations'
    ],
    pricing: {
      startingPrice: 'KES 6,000',
      packages: [
        {
          name: 'Basic Investigation',
          price: 'KES 6,000 - 10,000',
          features: ['Case definition', 'Basic line listing', 'Epidemic curve', 'Summary report']
        },
        {
          name: 'Comprehensive Investigation',
          price: 'KES 12,000 - 20,000',
          features: ['Complete outbreak investigation', 'Contact tracing analysis', 'Risk assessment', 'Detailed recommendations']
        },
        {
          name: 'Emergency Response',
          price: 'KES 25,000 - 40,000',
          features: ['Rapid response team', 'Real-time monitoring', 'Multi-agency coordination', 'Policy recommendations']
        }
      ]
    },
    deliverables: ['Investigation reports', 'Epidemic curves', 'Risk assessments', 'Public health recommendations'],
    timeline: '1-4 weeks',
    category: 'Public Health'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Professional graphic design services for posters, flyers, logos, infographics, and visual storytelling.',
    detailedDescription: 'Creative graphic design solutions for scientific communications, marketing materials, and visual data representation using industry-standard design tools.',
    features: [
      'Poster, flyer, logo, and brand design',
      'Infographics for scientific and health data',
      'Tools: Canva, Adobe Illustrator, Photoshop, Figma',
      'Visual storytelling for social media and reports',
      'Scientific poster design',
      'Data visualization graphics'
    ],
    pricing: {
      startingPrice: 'KES 2,500',
      packages: [
        {
          name: 'Basic Design',
          price: 'KES 2,500 - 5,000',
          features: ['Simple graphics', 'Basic branding', 'Standard formats', '3 revisions']
        },
        {
          name: 'Professional Package',
          price: 'KES 6,000 - 12,000',
          features: ['Complex infographics', 'Scientific posters', 'Brand identity', 'Multiple formats', 'Unlimited revisions']
        },
        {
          name: 'Enterprise Design',
          price: 'KES 15,000 - 25,000',
          features: ['Complete brand ecosystem', 'Marketing campaigns', 'Digital assets', 'Ongoing design support']
        }
      ]
    },
    deliverables: ['Design files', 'Print-ready formats', 'Digital assets', 'Brand guidelines'],
    timeline: '1-4 weeks',
    category: 'Design'
  },
  {
    id: 'epidemiology-biostatistics',
    title: 'Epidemiology & Biostatistics Consultancy',
    description: 'Expert epidemiological and biostatistical consultation for study design, analysis, and capacity building.',
    detailedDescription: 'Comprehensive epidemiological and biostatistical services including study design, protocol development, data analysis, and training for research and public health applications.',
    features: [
      'Study design and protocol development',
      'Data analysis and interpretation',
      'Capacity building workshops and training',
      'Monitoring & evaluation support and dashboards',
      'Biostatistical consulting',
      'Research methodology guidance'
    ],
    pricing: {
      startingPrice: 'KES 5,000',
      packages: [
        {
          name: 'Basic Consultation',
          price: 'KES 5,000 - 10,000',
          features: ['Study design review', 'Basic analysis', 'Methodology guidance', 'Report preparation']
        },
        {
          name: 'Comprehensive Support',
          price: 'KES 12,000 - 25,000',
          features: ['Full study support', 'Advanced analysis', 'Training workshops', 'Dashboard development']
        },
        {
          name: 'Research Partnership',
          price: 'KES 30,000 - 50,000',
          features: ['Long-term collaboration', 'Multiple studies', 'Capacity building program', 'Publication support']
        }
      ]
    },
    deliverables: ['Study protocols', 'Analysis reports', 'Training materials', 'Monitoring dashboards'],
    timeline: '2-12 weeks',
    category: 'Research & Consulting'
  }
];

export const getServiceById = (id: string): ServiceData | undefined => {
  return servicesData.find(service => service.id === id);
};

export const getServicesByCategory = (category: string): ServiceData[] => {
  return servicesData.filter(service => service.category === category);
};

export const getServiceCategories = (): string[] => {
  return Array.from(new Set(servicesData.map(service => service.category)));
};
