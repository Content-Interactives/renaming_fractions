import React, { useState } from 'react';

const RenamingFractions = () => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [gcdSteps, setGcdSteps] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [simplifiedNum, setSimplifiedNum] = useState(0);
  const [simplifiedDen, setSimplifiedDen] = useState(0);
  const [finalRepresentation, setFinalRepresentation] = useState('');
  const [showGlow, setShowGlow] = useState(true);
  const [showNextGlow, setShowNextGlow] = useState(false);

  const handleNumeratorChange = (e) => {
    const value = e.target.value;
    // Reject non-numeric characters
    if (value === '' || /^[0-9]+$/.test(value)) {
      // Only allow positive integers up to 1000
      if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 1000)) {
        setNumerator(value);
      }
    }
  };

  const handleDenominatorChange = (e) => {
    const value = e.target.value;
    // Reject non-numeric characters
    if (value === '' || /^[0-9]+$/.test(value)) {
      // Only allow positive integers up to 1000
      if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 1000)) {
        setDenominator(value);
      }
    }
  };

  const gcdWithSteps = (a, b) => {
    const steps = [];
    let x = Math.max(Math.abs(a), Math.abs(b));
    let y = Math.min(Math.abs(a), Math.abs(b));
    
    while (y !== 0) {
      const quotient = Math.floor(x / y);
      const remainder = x % y;
      
      steps.push({
        x: x,
        y: y,
        quotient: quotient,
        remainder: remainder
      });
      
      x = y;
      y = remainder;
    }
    
    return { gcd: x, steps: steps };
  };

  const [displayedNumerator, setDisplayedNumerator] = useState('');
  const [displayedDenominator, setDisplayedDenominator] = useState('');

  const handleSimplify = () => {
    // Basic validation
    if (!numerator || !denominator) {
      return;
    }
    
    setShowGlow(false); // Turn off glow when button is clicked
    setShowNextGlow(true); // Turn on Next button glow when Simplify is clicked
    
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    if (isNaN(num) || isNaN(den) || den === 0) {
      return;
    }
    
    // Store the current values for display
    setDisplayedNumerator(num);
    setDisplayedDenominator(den);

    const { gcd, steps: gcdCalcSteps } = gcdWithSteps(num, den);
    const simplifiedN = num / gcd;
    const simplifiedD = den / gcd;
    
    // Store the simplified values in state
    setSimplifiedNum(simplifiedN);
    setSimplifiedDen(simplifiedD);
    
    // Determine the final representation (proper fraction, mixed number, or whole number)
    let finalRep = '';
    if (simplifiedN === simplifiedD) {
      // Case: Equal numerator and denominator (e.g., 5/5 = 1)
      finalRep = `${simplifiedN}/${simplifiedD} = 1`;
    } else if (simplifiedN % simplifiedD === 0) {
      // Case: Numerator is a multiple of denominator (e.g., 10/5 = 2)
      finalRep = `${simplifiedN}/${simplifiedD} = ${simplifiedN / simplifiedD}`;
    } else if (simplifiedN > simplifiedD) {
      // Case: Improper fraction to mixed number (e.g., 7/3 = 2 1/3)
      const wholeNumber = Math.floor(simplifiedN / simplifiedD);
      const newNumerator = simplifiedN - (wholeNumber * simplifiedD);
      finalRep = `${simplifiedN}/${simplifiedD} = ${wholeNumber} ${newNumerator}/${simplifiedD}`;
    } else {
      // Case: Proper fraction (e.g., 3/5)
      finalRep = `${simplifiedN}/${simplifiedD}`;
    }
    
    // Store in state
    setFinalRepresentation(finalRep);

    setSteps([
      `Step 1: Find the Greatest Common Divisor (GCD) of ${num} and ${den} using the Euclidean division method:`,
      `Step 2: Divide both the numerator and denominator by the GCD (${gcd}):
${num} ÷ ${gcd} = ${simplifiedN}
${den} ÷ ${gcd} = ${simplifiedD}`,
      `Step 3: Write the simplified fraction in its final form:`,
      `Step 4: Simplification Complete!`
    ]);
    
    setGcdSteps(gcdCalcSteps);
    setCurrentStepIndex(0);
    setShowResults(true);
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: rgb(249, 250, 251); /* This is the equivalent of bg-gray-50 */
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .glow-button-white::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }
      `}</style>
      <div className="w-full max-w-md mx-auto shadow-md bg-white rounded-lg overflow-hidden select-none">
        <div className="p-3 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Enter a fraction to simplify:
          </label>
          <div className="space-y-2">
            <div className="flex flex-col space-y-1">
              <div className="flex space-x-2 items-center">
                <input
                  id="numeratorInput"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={numerator}
                  onChange={handleNumeratorChange}
                  placeholder="Numerator"
                  className="w-full text-base h-9 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  id="denominatorInput"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={denominator}
                  onChange={handleDenominatorChange}
                  placeholder="Denominator"
                  className="w-full text-base h-9 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className={`glow-button glow-button-white ${showGlow ? 'simple-glow' : 'simple-glow stopped'}`}>
                  <button
                    onClick={handleSimplify}
                    className="h-8 px-2 bg-[#00783E] hover:bg-[#006633] text-white text-sm rounded-md transition-colors"
                  >
                    Simplify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showResults && (
          <div className="p-3 flex flex-col items-start bg-gray-50 rounded-b-lg space-y-2">
            <div className="w-full">
              <h3 className="text-[#5750E3] text-sm font-medium mb-2">
                Steps to simplify the fraction ({displayedNumerator}/{displayedDenominator}):
              </h3>
              
              <div className="space-y-4">
                  <div className="w-full p-2 mb-1 bg-white border border-[#7973E9]/30 rounded-md">
                    {currentStepIndex === 0 ? (
                      <p className="text-sm whitespace-pre-line">{steps[currentStepIndex]}</p>
                    ) : currentStepIndex === 3 ? (
                      <>
                        <p className="text-sm">{steps[currentStepIndex]}</p>
                        <div className="flex justify-center items-center mt-2">
                          <div className="text-green-600 text-center">
                            {/* For improper fractions, show both representations */}
                            {simplifiedNum > simplifiedDen && simplifiedNum % simplifiedDen !== 0 ? (
                              <div className="flex items-center">
                                {/* Improper fraction */}
                                <div className="flex flex-col items-center justify-center">
                                  <div className="text-xl font-bold">{simplifiedNum}</div>
                                  <div className="border-t border-green-600 w-12 my-1"></div>
                                  <div className="text-xl font-bold">{simplifiedDen}</div>
                                </div>
                                
                                {/* Separator */}
                                <div className="mx-3 text-gray-700">or</div>
                                
                                {/* Mixed number */}
                                <div className="flex items-center">
                                  <div className="text-xl font-bold mr-2">
                                    {Math.floor(simplifiedNum / simplifiedDen)}
                                  </div>
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-xl font-bold">{simplifiedNum % simplifiedDen}</div>
                                    <div className="border-t border-green-600 w-12 my-1"></div>
                                    <div className="text-xl font-bold">{simplifiedDen}</div>
                                  </div>
                                </div>
                              </div>
                            ) : simplifiedDen === 1 ? (
                              /* When denominator is 1, show only the whole number */
                              <div className="text-xl font-bold">
                                {simplifiedNum}
                              </div>
                            ) : (
                              /* For proper fractions, whole numbers, or equal fractions, just show the one form */
                              <div className="flex flex-col items-center justify-center">
                                <div className="text-xl font-bold">{simplifiedNum}</div>
                                <div className="border-t border-green-600 w-12 my-1"></div>
                                <div className="text-xl font-bold">{simplifiedDen}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : currentStepIndex === 2 ? (
                      <>
                        <p className="text-sm">{steps[currentStepIndex].split('\n')[0]}</p>
                        <div className="mt-2 flex justify-center">
                          <div className="text-[#5750E3]">
                            <div className="flex items-center">
                              {finalRepresentation.includes('=') ? (
                                <>
                                  <div className="flex flex-col items-center mr-3">
                                    <div className="text-lg font-medium">{simplifiedNum}</div>
                                    <div className="border-t border-[#5750E3] w-8 my-1"></div>
                                    <div className="text-lg font-medium">{simplifiedDen}</div>
                                  </div>
                                  <div className="mx-2">=</div>
                                  {simplifiedNum === simplifiedDen ? (
                                    <div className="text-lg font-medium">1</div>
                                  ) : simplifiedNum % simplifiedDen === 0 ? (
                                    <div className="text-lg font-medium">{simplifiedNum / simplifiedDen}</div>
                                  ) : simplifiedNum > simplifiedDen ? (
                                    <div className="flex items-center">
                                      <div className="text-lg font-medium mr-2">
                                        {Math.floor(simplifiedNum / simplifiedDen)}
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <div className="text-lg font-medium">{simplifiedNum % simplifiedDen}</div>
                                        <div className="border-t border-[#5750E3] w-8 my-1"></div>
                                        <div className="text-lg font-medium">{simplifiedDen}</div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-lg font-medium">
                                      {finalRepresentation.split('=')[1].trim()}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <div className="text-lg font-medium">{simplifiedNum}</div>
                                  <div className="border-t border-[#5750E3] w-8 my-1"></div>
                                  <div className="text-lg font-medium">{simplifiedDen}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">{steps[currentStepIndex].split('\n')[0]}</p>
                        <div className="ml-4 mt-1">
                          {steps[currentStepIndex].split('\n').slice(1).map((line, i) => (
                            <p key={i} className="text-sm">{line}</p>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {currentStepIndex === 0 && (
                      <div className="font-mono mt-2 space-y-1 p-2 bg-[#7973E9]/5 rounded-md">
                        {gcdSteps.map((gcdStep, i) => (
                          <div key={i} className="text-xs">
                            <p className="font-medium text-[#5750E3]">
                              {i === 0 ? "First, divide the larger number by the smaller:" : 
                               "Next, divide the previous divisor by the remainder:"}
                            </p>
                            <p className="ml-2">
                              {gcdStep.x} ÷ {gcdStep.y} = {gcdStep.quotient} with remainder {gcdStep.remainder}
                            </p>
                            {i === gcdSteps.length - 1 && gcdStep.remainder === 0 && (
                              <p className="mt-1 text-[#5750E3] font-medium">
                                Since the remainder is 0, the GCD is the last divisor: {gcdStep.y}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="ml-1.5">
                      <button
                        onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentStepIndex === 0}
                        className="w-24 p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                      >
                        ← Previous
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Step {currentStepIndex + 1} of {steps.length}
                    </span>
                    <div className={`glow-button ${showNextGlow ? 'simple-glow' : 'simple-glow stopped'}`}>
                      <button
                        onClick={() => {
                          const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1);
                          setCurrentStepIndex(nextIndex);
                          if (nextIndex === steps.length - 1) {
                            setShowNextGlow(false);
                          }
                        }}
                        disabled={currentStepIndex === steps.length - 1}
                        className="w-24 p-1 rounded-md bg-[#00783E] text-white hover:bg-[#006633] disabled:opacity-50"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RenamingFractions;