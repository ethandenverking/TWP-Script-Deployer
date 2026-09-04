// A named, reusable snippet of TWP's proprietary scripting language. `content`
// is keyed by the `id` of the page it belongs to (see twp-pages.ts) since the
// same template can supply different text per page slot. This is NOT
// JavaScript — it's the exact text that gets pasted into TWP's own scripting
// textarea.
export interface TwpScriptTemplate {
  id: string
  label: string
  content: Record<string, string>
}

// Registry of every predefined script template offered when a user creates
// or edits a saved script. Add new templates here to make them selectable
// in the popup.
export const twpScriptTemplates: TwpScriptTemplate[] = [
  {
    id: 'blended-rates',
    label: 'Blended Rates',
    content: {
      otthreshold: '/// INITIALS - Blended Rates Calculation - XXXXXX - XX/XX/XXX //\n$rrpCategories = "Overtime";\n$hoursWorkedCategories = "Overtime";\nif(within(category, $rrpCategories) and reportingdate.weekhours($hoursWorkedCategories) > 0){\n$rate = reportingdate.totalweek("BlendRate") / reportingdate.weekhours($hoursWorkedCategories); \nif(isedited("Payrate") = false){ \npayrate = round($rate,2);\n}\n}',
      payrate: `/// INITIALS - Blended Rates Calculation - XXXXXX - XX/XX/XXX //
      $blendedCategories = "Regular|Makeup Time|Travel Time|Non-Discretionary Bonus";
                    if(within(category, $blendedCategories)){
                        if(ishours or istimes){
                            BlendRate = payrate * hours;
                        }
                        if(ispayonly){
                            BlendRate = amount;
                        }
                    }`,
    },
  },
  {
    id: 'unpay-after-ot-threshold-pp',
    label: 'Unpay OT after threshold PP',
    content: {
      splitpostreportingdate: `/// INITIALS - Unpay OT after threshold PP - XXXXXX - XX/XX/XXX //
if (category = "Regular") {
    payperiodhours = hours;
}

$ot = 80;
$pwhours = reportingdate.totalpp("payperiodhours") - reportingdate.totalweek("payperiodhours");
$whours = reportingdate.hourstodateot + $pwhours;
$dhours = reportingdate.totalhoursot;
$uptohours = hourstopunchot + ($whours - $dhours);
$uptohoursinc = $uptohours + hours;
$uptohoursinc = round($uptohoursinc, 2);
//addalert($whours);
if($uptohoursinc > $ot and $uptohours < $ot and istimes and category <> "OT" and reportingdate.totalhours("OT") = 0){

$diff = hours - ($ot - $uptohours);
unpay($diff);
addalert("Unpaying portion of hours for Comp Time");
compHours = $diff;

}

$whours = reportingdate.hourstodateot + $pwhours;
$dhours = reportingdate.totalhoursot;
$uptohours = hourstopunchot + ($whours - $dhours);
$uptohours = round($uptohours, 2);
if($uptohours >= $ot and istimes){
unpay(hours);
compHours = hours;
addalert("Unpaying hours for Comp Time");
}
`,
    },
  },
]
