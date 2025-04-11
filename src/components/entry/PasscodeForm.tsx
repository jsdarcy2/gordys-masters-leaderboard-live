
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";

interface PasscodeFormProps {
  onSuccess: () => void;
}

const PasscodeSchema = z.object({
  passcode: z.string().min(4, "Passcode must be at least 4 characters"),
});

type PasscodeFormValues = z.infer<typeof PasscodeSchema>;

const PASSCODE = "augusta2025"; // You can change this or make it dynamic

const PasscodeForm = ({ onSuccess }: PasscodeFormProps) => {
  const [attempts, setAttempts] = useState(0);
  
  const form = useForm<PasscodeFormValues>({
    resolver: zodResolver(PasscodeSchema),
    defaultValues: {
      passcode: "",
    },
  });
  
  const onSubmit = (data: PasscodeFormValues) => {
    if (data.passcode.toLowerCase() === PASSCODE) {
      onSuccess();
    } else {
      setAttempts(attempts + 1);
      form.setError("passcode", { 
        message: `Incorrect passcode. Please try again. (Attempt ${attempts + 1})`
      });
    }
  };
  
  return (
    <Card className="shadow-lg border-t-4 border-t-masters-green">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-serif text-masters-green text-center">
          Enter Pool Passcode
        </CardTitle>
        <p className="text-gray-500 text-sm text-center">
          Please enter the passcode to access Gordy's Masters Pool
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="passcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-serif text-masters-green">
                    Passcode
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Enter passcode"
                        className="pl-10"
                        type="password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-masters-green hover:bg-masters-dark"
            >
              Submit
            </Button>
            
            <div className="text-xs text-center text-gray-500 mt-4">
              <p>Need the passcode? Contact the pool administrator.</p>
              <p className="mt-1">First time? The passcode is: <span className="font-bold">augusta2025</span></p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasscodeForm;
