
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, BarChart3, Target, FileText, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

const StrokeCaseStudy = () => {
  return (
    <>
      <SEO 
        title="Clinical Study of Stroke - DataQuest Solutions"
        description="Comprehensive clinical study investigating key determinants of stroke and developing predictive models for risk assessment using advanced statistical analysis."
        keywords={["stroke study", "clinical research", "predictive modeling", "healthcare analytics", "risk assessment", "medical statistics"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <WhatsAppButton />
        
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="bg-red-600/20 text-red-400 border-red-400 mb-4">
                Healthcare Analytics
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Clinical Study of Stroke
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-6 text-blue-200 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Enock Bereka</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>December 20, 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>20 min read</span>
                </div>
              </div>
            </div>

            {/* Abstract */}
            <Card className="bg-blue-800/50 border-blue-700 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Abstract</h2>
                </div>
                <div className="text-blue-100 space-y-4 leading-relaxed">
                  <p>
                    <strong>Background:</strong> Stroke remains a major public health concern globally, contributing significantly to 
                    morbidity and mortality. The condition arises due to an interruption of blood supply to the brain, often 
                    resulting in long-term disability or fatality. Understanding the demographic and clinical risk factors 
                    associated with stroke is essential for effective prevention and management strategies. This study aims 
                    to investigate the key determinants of stroke and develop a predictive model for risk assessment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Methods */}
            <Card className="bg-blue-800/50 border-blue-700 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-6 h-6 text-green-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Methods</h2>
                </div>
                <div className="text-blue-100 space-y-4 leading-relaxed">
                  <p>
                    This study utilized a dataset sourced from the <strong>African Centre for Disease Control</strong>, comprising 
                    <strong> 5,110 individuals</strong> with various demographic and clinical attributes, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Age and gender demographics</li>
                    <li>Hypertension status</li>
                    <li>Heart disease history</li>
                    <li>Marital status and work type</li>
                    <li>Residence location</li>
                    <li>Smoking status</li>
                    <li>BMI and glucose levels</li>
                  </ul>
                  <p>
                    The dataset underwent comprehensive preprocessing, including handling missing values, transforming 
                    categorical variables into factors, and performing statistical standardization. Descriptive statistical 
                    analysis was conducted to summarize the dataset, while chi-square tests and t-tests were employed 
                    for bivariate analysis to determine associations between stroke and key variables.
                  </p>
                  <p>
                    Logistic regression modeling was implemented to identify significant predictors of stroke. Model 
                    performance was assessed using the area under the receiver operating characteristic (ROC) curve 
                    (AUC) to evaluate classification accuracy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-blue-800/50 border-blue-700 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <BarChart3 className="w-6 h-6 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Results</h2>
                </div>
                <div className="text-blue-100 space-y-6 leading-relaxed">
                  <p>
                    The analysis revealed that several factors exhibited significant associations with stroke occurrence (p &lt; 0.05):
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-600">
                      <h4 className="font-semibold text-white mb-2">Significant Risk Factors</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Age</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Hypertension</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Heart disease</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Smoking status</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Glucose levels</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-600">
                      <h4 className="font-semibold text-white mb-2">Logistic Regression Results</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Age: OR = 1.08, p &lt; 0.001</li>
                        <li>Hypertension: OR = 1.37, p = 0.054</li>
                        <li>Glucose level: OR = 1.00, p = 0.007</li>
                        <li>BMI: OR = 1.00, p &lt; 0.001</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-600 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                      <h4 className="font-semibold text-white">Model Performance</h4>
                    </div>
                    <p className="text-green-100">
                      The predictive model demonstrated <strong>strong classification performance with an AUC of 0.853</strong>, 
                      indicating high reliability in distinguishing individuals at risk of stroke.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card className="bg-blue-800/50 border-blue-700 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Conclusions &amp; Implications</h2>
                </div>
                <div className="text-blue-100 space-y-4 leading-relaxed">
                  <p>
                    The findings of this study underscore the necessity of <strong>proactive screening and intervention 
                    strategies</strong> for individuals at elevated risk of stroke. Key risk factors such as age, hypertension, 
                    glucose levels, and BMI should be closely monitored to facilitate early diagnosis and effective management.
                  </p>
                  
                  <div className="bg-blue-900/50 p-6 rounded-lg border border-blue-600">
                    <h4 className="font-semibold text-white mb-3">Clinical Recommendations:</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Implement routine screening for hypertension and glucose monitoring</li>
                      <li>Develop age-specific risk assessment protocols</li>
                      <li>Focus on BMI management as a modifiable risk factor</li>
                      <li>Create targeted intervention programs for high-risk populations</li>
                    </ul>
                  </div>
                  
                  <p>
                    The study provides valuable insights into stroke risk stratification, supporting the development of 
                    <strong> targeted healthcare policies and preventive measures</strong>. The high predictive accuracy 
                    (AUC = 0.853) demonstrates the potential for implementing these models in clinical practice for 
                    early risk identification and intervention.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Study Impact */}
            <Card className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 border-blue-700">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Study Impact &amp; Future Directions</h3>
                <div className="text-blue-100 space-y-3">
                  <p>
                    This research contributes to the growing body of evidence supporting data-driven approaches 
                    in stroke prevention and management. The predictive model developed in this study can serve 
                    as a foundation for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Clinical decision support systems</li>
                    <li>Population health screening programs</li>
                    <li>Resource allocation in healthcare settings</li>
                    <li>Policy development for stroke prevention initiatives</li>
                  </ul>
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

export default StrokeCaseStudy;
