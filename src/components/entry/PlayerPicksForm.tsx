import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy, Loader2, Check, Golf } from "lucide-react";

const PlayerPicksSchema = z.object({
  participantName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  tiebreaker: z.string().regex(/^-?\d+$/, "Must be a valid number"),
  agreeToRules: z.boolean().refine(val => val, "You must agree to the rules"),
  paymentMethod: z.enum(["venmo", "paypal", "cash", "check"]),
  golfers: z.array(z.string()).min(4, "You must pick exactly 4 golfers").max(4, "You must pick exactly 4 golfers"),
});

type PlayerPicksFormValues = z.infer<typeof PlayerPicksSchema>;

interface PlayerPicksFormProps {
  onSubmit: () => void;
}

const availableGolfers = [
  "Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Bryson DeChambeau", 
  "Collin Morikawa", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", 
  "Viktor Hovland", "Ludvig Åberg", "Tommy Fleetwood", "Shane Lowry", 
  "Justin Thomas", "Hideki Matsuyama", "Cameron Smith", "Jordan Spieth", 
  "Will Zalatoris", "Russell Henley", "Tyrrell Hatton", "Adam Scott", 
  "Dustin Johnson", "Tony Finau", "Joaquín Niemann", "Min Woo Lee", 
  "Tom Kim", "Max Homa", "Sepp Straka", "Corey Conners", 
  "Jason Day", "Matt Fitzpatrick", "Robert MacIntyre", "Cameron Young"
];

const PlayerPicksForm = ({ onSubmit }: PlayerPicksFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PlayerPicksFormValues>({
    resolver: zodResolver(PlayerPicksSchema),
    defaultValues: {
      participantName: "",
      email: "",
      tiebreaker: "",
      agreeToRules: false,
      paymentMethod: "venmo",
      golfers: [],
    },
  });
  
  const handleSubmit = (data: PlayerPicksFormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Form submitted with data:", data);
      setIsSubmitting(false);
      onSubmit();
    }, 1500);
  };
  
  return (
    <Card className="shadow-lg border-t-4 border-t-masters-green">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-serif text-masters-green flex items-center justify-center gap-2">
          <Trophy size={24} className="text-masters-yellow" />
          Select Your Players
          <Trophy size={24} className="text-masters-yellow" />
        </CardTitle>
        <p className="text-gray-500 text-sm text-center">
          Choose wisely! Pick 4 golfers to compete in Gordy's Masters Pool.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="participantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif text-masters-green">
                      Your Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif text-masters-green">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tiebreaker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-serif text-masters-green">
                    Tiebreaker: What will the winner's final score be? (e.g. -12, +1)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter winner's score (e.g. -12)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <h3 className="font-serif text-masters-green text-lg flex items-center gap-2">
                <Golf className="text-masters-green" size={20} />
                Select Your 4 Golfers
              </h3>
              
              <FormField
                control={form.control}
                name="golfers"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableGolfers.map((golfer) => (
                        <FormField
                          key={golfer}
                          control={form.control}
                          name="golfers"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={golfer}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(golfer)}
                                    disabled={field.value.length >= 4 && !field.value.includes(golfer)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...field.value, golfer]
                                        : field.value.filter((value) => value !== golfer);
                                      
                                      field.onChange(updatedValue.slice(0, 4));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm cursor-pointer">
                                  {golfer}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {form.watch("golfers").length}/4 golfers
                    </p>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-serif text-masters-green">
                    How will you pay the $25 entry fee?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="venmo" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Venmo (@GordyMasters)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="paypal" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          PayPal (pool@gordymasters.com)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Cash (in person)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="check" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Check (to Gordon Masters)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agreeToRules"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the rules of Gordy's Masters Pool
                    </FormLabel>
                    <p className="text-sm text-gray-500">
                      By checking this box, you confirm you've read the rules and agree to participate.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-masters-green hover:bg-masters-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Picks
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlayerPicksForm;
