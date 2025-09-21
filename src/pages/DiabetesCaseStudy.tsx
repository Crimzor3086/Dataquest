
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Database, Heart, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiabetesCaseStudy = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Clinical Study of Diabetes - Machine Learning Case Study | DataQuest Solutions"
        description="Comprehensive diabetes prediction study using statistical analysis and machine learning models. Learn how we developed predictive models and real-time dashboards for early diabetes detection."
        keywords={['diabetes study', 'machine learning healthcare', 'clinical data analysis', 'predictive modeling', 'healthcare analytics', 'diabetes prediction']}
        url="https://dataquestsolutions.com/blog/diabetes-case-study"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        
        <div className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/blog')}
                className="mb-6 bg-blue-700/50 border-blue-600 text-white hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-red-600/20 text-red-400 border-red-400">Healthcare</Badge>
                <Badge className="bg-green-600/20 text-green-400 border-green-400">Machine Learning</Badge>
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-400">Data Science</Badge>
                <Badge className="bg-orange-600/20 text-orange-400 border-orange-400">Case Study</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Clinical Study of Diabetes: Advanced Predictive Modeling & Risk Assessment
              </h1>
              
              <div className="text-blue-200 mb-8">
                <p className="text-lg mb-4">
                  A comprehensive data science approach to diabetes prediction using statistical analysis, 
                  machine learning, and real-time dashboard implementation for clinical decision support.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>By DataQuest Solutions Team</span>
                  <span>•</span>
                  <span>Healthcare Analytics Project</span>
                  <span>•</span>
                  <span>15 min read</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mb-12">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop" 
                alt="Healthcare Data Analytics"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Project Overview */}
            <Card className="mb-8 bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-red-400" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-4">
                <p>
                  This comprehensive clinical study focuses on developing advanced predictive models 
                  for early diabetes detection and risk assessment. Our approach combines traditional 
                  statistical analysis with cutting-edge machine learning techniques to create actionable 
                  insights for healthcare professionals.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-900/50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Patient Population</h4>
                    <p className="text-sm text-blue-200">Diverse demographic analysis</p>
                  </div>
                  <div className="text-center p-4 bg-blue-900/50 rounded-lg">
                    <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">ML Models</h4>
                    <p className="text-sm text-blue-200">8 different algorithms tested</p>
                  </div>
                  <div className="text-center p-4 bg-blue-900/50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Accuracy Achieved</h4>
                    <p className="text-sm text-blue-200">95%+ prediction accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Objectives */}
            <Card className="mb-8 bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
                  Study Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Summarize key demographic and health-related variables in the diabetes dataset</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Assess the distribution of demographic and health-related characteristics among individuals with and without diabetes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Explore associations between diabetes and key risk factors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Develop and evaluate a logistic regression model to assess the impact of demographic and health-related factors on diabetes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Formulate conclusive insights and data-driven recommendations for diabetes prevention</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Implement various machine learning models for early prediction and diagnosis to increase screening accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Develop a real-time data dashboard for instant risk assessments and diagnostic support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Methodology */}
            <Card className="mb-8 bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <Database className="w-6 h-6 mr-3 text-green-400" />
                  Methodology
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-6">
                {/* Data Collection */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3.1 Data Collection and Preparation</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• Comprehensive dataset sourcing with detailed variable descriptions</li>
                    <li>• Advanced feature engineering techniques applied</li>
                    <li>• Data preprocessing, normalization, and strategic feature selection</li>
                    <li>• Quality assurance and data validation protocols</li>
                  </ul>
                </div>

                {/* Statistical Analysis */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3.2 Statistical Analysis</h3>
                  
                  <div className="ml-4 space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-blue-300 mb-2">3.2.1 Univariate Analysis</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Descriptive statistics for pregnancies, BMI, glucose, skin thickness, insulin, diabetes pedigree function, and age</li>
                        <li>• Comprehensive frequency distributions and data visualization</li>
                        <li>• Distribution assessment and outlier detection</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-blue-300 mb-2">3.2.2 Bivariate Analysis</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Correlation analysis to assess relationships among numeric variables</li>
                        <li>• Chi-square tests, ANOVA, and t-tests for association examination</li>
                        <li>• Risk factor identification and statistical significance testing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Multivariate Analysis */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3.3 Multivariate Analysis</h3>
                  
                  <div className="ml-4 space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-blue-300 mb-2">3.3.1 Logistic Regression Modeling</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Binary logistic regression model development</li>
                        <li>• Model assessment using AUC-ROC analysis, R-squared, AIC, and RMSE</li>
                        <li>• Feature importance plotting for predictor influence determination</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-blue-300 mb-2">3.3.2 Machine Learning Implementation</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Random Forest, Decision Trees, Naïve Bayes Classifier</li>
                        <li>• Support Vector Machines, K-Nearest Neighbors</li>
                        <li>• Linear Discriminant Analysis, Gradient Boosting Machines</li>
                        <li>• Neural Networks for advanced pattern recognition</li>
                        <li>• Performance comparison using accuracy, precision, recall, F1-score, and AUC metrics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-blue-300 mb-2">3.3.3 Interactive Dashboard Development</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Real-time data dashboard implementation</li>
                        <li>• Instant risk assessment capabilities</li>
                        <li>• Clinical decision support integration</li>
                        <li>• User-friendly interface for healthcare professionals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expected Outcomes */}
            <Card className="mb-8 bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                  Expected Outcomes & Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Healthcare Policy Impact</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Support for evidence-based healthcare policies through data-driven insights</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Feasibility assessment for ML system implementation in local healthcare facilities</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Clinical Benefits</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Enhanced early detection rates through improved diagnostic accuracy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Increased accessibility to diabetes screening in rural areas</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-blue-700/50 to-purple-700/50 border-blue-600">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Interested in Our Healthcare Analytics Services?</h3>
                <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                  Let us help you implement similar data-driven solutions for your healthcare organization. 
                  Our team specializes in clinical data analysis, predictive modeling, and dashboard development.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate('/consultation')}
                  >
                    Schedule Consultation
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    onClick={() => navigate('/contacts')}
                  >
                    Contact Our Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default DiabetesCaseStudy;
