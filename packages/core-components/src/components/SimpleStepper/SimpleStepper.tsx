/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ReactNode,
  createContext,
  Children,
  isValidElement,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import MuiStepper from '@material-ui/core/Stepper';

type InternalState = {
  stepperLength: number;
  stepIndex: number;
  setStepIndex: any;
  stepHistory: number[];
  setStepHistory: any;
  onStepChange?: (prevIndex: number, nextIndex: number) => void;
};

const noop = () => {};

export const VerticalStepperContext = createContext<InternalState>({
  stepperLength: 0,
  stepIndex: 0,
  setStepIndex: noop,
  stepHistory: [],
  setStepHistory: noop,
  onStepChange: noop,
});

export interface StepperProps {
  elevated?: boolean;
  onStepChange?: (prevIndex: number, nextIndex: number) => void;
  activeStep?: number;
}

export function SimpleStepper(props: PropsWithChildren<StepperProps>) {
  const { children, elevated, onStepChange, activeStep = 0 } = props;
  const [stepIndex, setStepIndex] = useState<number>(activeStep);
  /*
  Recreates the stepHistory array based on the activeStep
  to make sure the handleBack function of the Footer works when activeStep is higher than 0
  */
  const inOrderRecreatedStepHistory = Array.from(
    { length: activeStep + 1 },
    (_, i) => i,
  );
  const [stepHistory, setStepHistory] = useState<number[]>(
    inOrderRecreatedStepHistory,
  );

  useEffect(() => {
    setStepIndex(activeStep);
  }, [activeStep]);

  const steps: ReactNode[] = [];
  let endStep;
  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.props.end) {
        endStep = child;
      } else {
        steps.push(child);
      }
    }
  });

  return (
    <>
      <VerticalStepperContext.Provider
        value={{
          stepIndex,
          setStepIndex,
          stepHistory,
          setStepHistory,
          onStepChange,
          stepperLength: Children.count(children),
        }}
      >
        <MuiStepper
          activeStep={stepIndex}
          orientation="vertical"
          elevation={elevated ? 2 : 0}
        >
          {steps}
        </MuiStepper>
      </VerticalStepperContext.Provider>
      {stepIndex >= Children.count(children) - 1 && endStep}
    </>
  );
}
