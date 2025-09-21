
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CreditCard, User, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: any) => void;
  courseId?: string;
  courseName?: string;
  coursePrice?: number;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSubmit, 
  courseId, 
  courseName, 
  coursePrice 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    
    // Contact Information
    address: '',
    city: '',
    country: '',
    postalCode: '',
    
    // Educational Background
    education: '',
    institution: '',
    fieldOfStudy: '',
    experience: '',
    
    // Course Specific
    motivation: '',
    goals: '',
    
    // Payment Information
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast.error('Please fill in all required personal information fields');
          return false;
        }
        break;
      case 2:
        if (!formData.address || !formData.city || !formData.country) {
          toast.error('Please fill in all required contact information fields');
          return false;
        }
        break;
      case 3:
        if (!formData.education) {
          toast.error('Please provide your educational background');
          return false;
        }
        break;
      case 4:
        if (!formData.motivation) {
          toast.error('Please share your motivation for taking this course');
          return false;
        }
        break;
      case 5:
        if (!formData.paymentMethod || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
          toast.error('Please fill in all payment information fields');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      const registrationData = {
        ...formData,
        courseId,
        courseName,
        coursePrice,
        registeredAt: new Date().toISOString()
      };
      onSubmit(registrationData);
      toast.success('Registration completed successfully!');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-400" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-gray-300">Gender</Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-400" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address" className="text-gray-300">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-gray-300">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-gray-300">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-gray-300">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-400" />
              Educational Background
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="education" className="text-gray-300">Highest Education Level *</Label>
                <Select onValueChange={(value) => handleInputChange('education', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="institution" className="text-gray-300">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="fieldOfStudy" className="text-gray-300">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="experience" className="text-gray-300">Work Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Briefly describe your work experience..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Course Information</h3>
            {courseName && (
              <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-700">
                <h4 className="text-lg font-semibold text-blue-400">{courseName}</h4>
                {coursePrice && (
                  <p className="text-gray-300">Price: KES {coursePrice.toLocaleString()}</p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="motivation" className="text-gray-300">Why do you want to take this course? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Share your motivation and what you hope to achieve..."
                required
              />
            </div>
            <div>
              <Label htmlFor="goals" className="text-gray-300">Learning Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="What specific goals do you have for this course?"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
              Payment Information
            </h3>
            {coursePrice && (
              <div className="p-4 bg-green-900/50 rounded-lg border border-green-700">
                <p className="text-lg font-semibold text-green-400">
                  Total Amount: KES {coursePrice.toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="paymentMethod" className="text-gray-300">Payment Method *</Label>
              <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cardholderName" className="text-gray-300">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="cardNumber" className="text-gray-300">Card Number *</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-gray-300">CVV *</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Course Registration</CardTitle>
        <CardDescription className="text-gray-300">
          Step {currentStep} of 5: Complete your registration
        </CardDescription>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Previous
              </Button>
            )}
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white ml-auto"
              >
                Complete Registration
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
