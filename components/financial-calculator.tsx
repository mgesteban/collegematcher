"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchResult, StudentProfile } from "@/types"
import { DollarSign, Calculator, PiggyBank, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface FinancialCalculatorProps {
  matches: MatchResult[]
  studentProfile: StudentProfile
}

interface FinancialBreakdown {
  collegeId: string
  collegeName: string
  tuition: number
  fees: number
  books: number
  transportation: number
  personalExpenses: number
  housing: number
  totalCost: number
  financialAid: number
  outOfPocket: number
  monthlyPayment: number
  loanAmount: number
  totalLoanCost: number
}

interface FinancialAidEstimate {
  pellGrant: number
  stateGrant: number
  institutionalAid: number
  workStudy: number
  subsidizedLoan: number
  unsubsidizedLoan: number
  totalAid: number
}

export default function FinancialCalculator({ matches, studentProfile }: FinancialCalculatorProps) {
  const [selectedCollege, setSelectedCollege] = useState<string>("")
  const [livingArrangement, setLivingArrangement] = useState<"home" | "campus" | "off-campus">("home")
  const [workHours, setWorkHours] = useState<number>(0)
  const [parentIncome, setParentIncome] = useState<number>(50000)
  const [studentIncome, setStudentIncome] = useState<number>(0)
  const [savings, setSavings] = useState<number>(1000)
  const [otherAid, setOtherAid] = useState<number>(0)
  const [creditScore, setCreditScore] = useState<"excellent" | "good" | "fair" | "poor">("good")

  const [financialBreakdowns, setFinancialBreakdowns] = useState<FinancialBreakdown[]>([])

  useEffect(() => {
    calculateFinancials()
  }, [matches, livingArrangement, workHours, parentIncome, studentIncome, savings, otherAid])

  const estimateFinancialAid = (income: number, isDependent = true): FinancialAidEstimate => {
    const adjustedIncome = Math.max(0, income - 25000) // Simplified EFC calculation

    // Pell Grant estimation (max $7,395 for 2024-25)
    const pellGrant = Math.max(0, 7395 - adjustedIncome * 0.22)

    // State grant estimation (varies by state, using average)
    const stateGrant = income < 60000 ? Math.max(0, 2000 - adjustedIncome * 0.05) : 0

    // Institutional aid (community colleges typically offer less)
    const institutionalAid = income < 40000 ? 1500 : income < 80000 ? 1000 : 0

    // Work study
    const workStudy = workHours > 0 ? Math.min(workHours * 15 * 20, 2000) : 0 // $15/hr, 20 weeks

    // Loan eligibility
    const subsidizedLoan = income < 80000 ? 3500 : 0 // First year dependent student
    const unsubsidizedLoan = 2000 // Additional unsubsidized for dependent students

    return {
      pellGrant: Math.round(pellGrant),
      stateGrant: Math.round(stateGrant),
      institutionalAid: Math.round(institutionalAid),
      workStudy: Math.round(workStudy),
      subsidizedLoan: Math.round(subsidizedLoan),
      unsubsidizedLoan: Math.round(unsubsidizedLoan),
      totalAid: Math.round(pellGrant + stateGrant + institutionalAid + workStudy + subsidizedLoan + unsubsidizedLoan),
    }
  }

  const calculateFinancials = () => {
    const breakdowns: FinancialBreakdown[] = matches.map((match) => {
      const college = match.college

      // Base costs
      const tuition = college.costs.inStateTuition
      const fees = college.costs.fees
      const books = 1500 // Estimated books and supplies

      // Variable costs based on living arrangement
      let housing = 0
      let transportation = 0
      let personalExpenses = 3000

      switch (livingArrangement) {
        case "home":
          housing = 0
          transportation = 2000
          break
        case "campus":
          housing = 8000 // Average community college housing
          transportation = 500
          personalExpenses = 4000
          break
        case "off-campus":
          housing = 6000
          transportation = 1500
          personalExpenses = 3500
          break
      }

      const totalCost = tuition + fees + books + housing + transportation + personalExpenses

      // Financial aid estimation
      const aidEstimate = estimateFinancialAid(parentIncome + studentIncome)
      const totalFinancialAid = aidEstimate.totalAid + otherAid

      const outOfPocket = Math.max(0, totalCost - totalFinancialAid - savings)

      // If student needs loans
      const loanAmount = Math.max(0, outOfPocket)
      const interestRate =
        creditScore === "excellent" ? 0.045 : creditScore === "good" ? 0.055 : creditScore === "fair" ? 0.065 : 0.075

      // Calculate monthly payment for 10-year repayment
      const monthlyRate = interestRate / 12
      const numPayments = 120 // 10 years
      const monthlyPayment =
        loanAmount > 0
          ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1)
          : 0

      const totalLoanCost = monthlyPayment * numPayments

      return {
        collegeId: college.id,
        collegeName: college.name,
        tuition,
        fees,
        books,
        transportation,
        personalExpenses,
        housing,
        totalCost,
        financialAid: totalFinancialAid,
        outOfPocket,
        monthlyPayment,
        loanAmount,
        totalLoanCost,
      }
    })

    setFinancialBreakdowns(breakdowns.sort((a, b) => a.outOfPocket - b.outOfPocket))
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAffordabilityColor = (cost: number): string => {
    if (cost <= studentProfile.financialConstraints.maxTuition) return "text-green-600"
    if (cost <= studentProfile.financialConstraints.maxTuition * 1.5) return "text-yellow-600"
    return "text-red-600"
  }

  const selectedBreakdown = financialBreakdowns.find((b) => b.collegeId === selectedCollege)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Financial Calculator & Cost Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
              <TabsTrigger value="aid">Financial Aid Info</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              {/* Input Controls */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Information</h3>

                  <div>
                    <Label>Parent/Family Income (Annual)</Label>
                    <div className="mt-1">
                      <Slider
                        value={[parentIncome]}
                        onValueChange={(value) => setParentIncome(value[0])}
                        max={200000}
                        min={0}
                        step={5000}
                      />
                      <div className="text-center mt-1 text-sm text-gray-600">{formatCurrency(parentIncome)}</div>
                    </div>
                  </div>

                  <div>
                    <Label>Your Annual Income</Label>
                    <Input
                      type="number"
                      value={studentIncome}
                      onChange={(e) => setStudentIncome(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label>Current Savings for College</Label>
                    <Input
                      type="number"
                      value={savings}
                      onChange={(e) => setSavings(Number(e.target.value))}
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <Label>Other Financial Aid/Scholarships</Label>
                    <Input
                      type="number"
                      value={otherAid}
                      onChange={(e) => setOtherAid(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Living & Work Preferences</h3>

                  <div>
                    <Label>Living Arrangement</Label>
                    <Select value={livingArrangement} onValueChange={(value: any) => setLivingArrangement(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Live at Home</SelectItem>
                        <SelectItem value="campus">On-Campus Housing</SelectItem>
                        <SelectItem value="off-campus">Off-Campus Apartment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Work-Study Hours per Week</Label>
                    <div className="mt-1">
                      <Slider
                        value={[workHours]}
                        onValueChange={(value) => setWorkHours(value[0])}
                        max={20}
                        min={0}
                        step={5}
                      />
                      <div className="text-center mt-1 text-sm text-gray-600">{workHours} hours/week</div>
                    </div>
                  </div>

                  <div>
                    <Label>Credit Score (for loan rates)</Label>
                    <Select value={creditScore} onValueChange={(value: any) => setCreditScore(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (750+)</SelectItem>
                        <SelectItem value="good">Good (700-749)</SelectItem>
                        <SelectItem value="fair">Fair (650-699)</SelectItem>
                        <SelectItem value="poor">Poor (Below 650)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown for Selected College */}
              {selectedBreakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedBreakdown.collegeName} - Detailed Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Annual Costs
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tuition & Fees:</span>
                            <span>{formatCurrency(selectedBreakdown.tuition + selectedBreakdown.fees)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Books & Supplies:</span>
                            <span>{formatCurrency(selectedBreakdown.books)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Housing:</span>
                            <span>{formatCurrency(selectedBreakdown.housing)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transportation:</span>
                            <span>{formatCurrency(selectedBreakdown.transportation)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Personal Expenses:</span>
                            <span>{formatCurrency(selectedBreakdown.personalExpenses)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Annual Cost:</span>
                            <span>{formatCurrency(selectedBreakdown.totalCost)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-1">
                          <PiggyBank className="h-4 w-4" />
                          Financial Aid & Payment
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-green-600">
                            <span>Total Financial Aid:</span>
                            <span>-{formatCurrency(selectedBreakdown.financialAid)}</span>
                          </div>
                          <div className="flex justify-between text-blue-600">
                            <span>Savings Applied:</span>
                            <span>-{formatCurrency(Math.min(savings, selectedBreakdown.totalCost))}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Out-of-Pocket Cost:</span>
                            <span className={getAffordabilityColor(selectedBreakdown.outOfPocket)}>
                              {formatCurrency(selectedBreakdown.outOfPocket)}
                            </span>
                          </div>
                          {selectedBreakdown.loanAmount > 0 && (
                            <>
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex justify-between text-orange-600">
                                  <span>Loan Amount Needed:</span>
                                  <span>{formatCurrency(selectedBreakdown.loanAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>Monthly Payment (10 years):</span>
                                  <span>{formatCurrency(selectedBreakdown.monthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>Total Loan Cost:</span>
                                  <span>{formatCurrency(selectedBreakdown.totalLoanCost)}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <div className="grid gap-4">
                {financialBreakdowns.map((breakdown, index) => (
                  <Card
                    key={breakdown.collegeId}
                    className={`cursor-pointer transition-all ${
                      selectedCollege === breakdown.collegeId ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedCollege(breakdown.collegeId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{breakdown.collegeName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {index === 0 && <Badge variant="default">Most Affordable</Badge>}
                            <Badge
                              variant={
                                breakdown.outOfPocket <= studentProfile.financialConstraints.maxTuition
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {breakdown.outOfPocket <= studentProfile.financialConstraints.maxTuition
                                ? "Within Budget"
                                : "Over Budget"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(breakdown.outOfPocket)}
                          </div>
                          <div className="text-sm text-gray-600">out-of-pocket</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Total Cost</div>
                          <div className="font-medium">{formatCurrency(breakdown.totalCost)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Financial Aid</div>
                          <div className="font-medium text-green-600">-{formatCurrency(breakdown.financialAid)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Monthly Loan Payment</div>
                          <div className="font-medium">
                            {breakdown.monthlyPayment > 0 ? formatCurrency(breakdown.monthlyPayment) : "None"}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">ROI Rating</div>
                          <div className="font-medium">
                            {breakdown.outOfPocket < 15000
                              ? "Excellent"
                              : breakdown.outOfPocket < 25000
                                ? "Good"
                                : "Fair"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="aid" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Financial Aid Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-600">Federal Pell Grant</h4>
                      <p className="text-sm text-gray-600">
                        Need-based grant that doesn't need to be repaid. Up to $7,395 per year.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600">State Grants</h4>
                      <p className="text-sm text-gray-600">
                        State-funded aid programs, often need-based with residency requirements.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-600">Work-Study Programs</h4>
                      <p className="text-sm text-gray-600">
                        Part-time employment to help pay education expenses while enrolled.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-600">Federal Student Loans</h4>
                      <p className="text-sm text-gray-600">
                        Low-interest loans from the federal government. Must be repaid with interest.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Financial Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Complete FAFSA Early</h4>
                        <p className="text-xs text-gray-600">
                          Submit your Free Application for Federal Student Aid as soon as possible after October 1st.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Apply for Scholarships</h4>
                        <p className="text-xs text-gray-600">
                          Look for local, state, and national scholarship opportunities.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Consider Community College First</h4>
                        <p className="text-xs text-gray-600">
                          Save money on general education requirements before transferring.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Understand Loan Terms</h4>
                        <p className="text-xs text-gray-600">
                          Know the difference between subsidized and unsubsidized loans.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
