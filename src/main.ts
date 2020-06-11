import { FASTDesignSystemProvider, FASTSwitch, neutralLayerL1Behavior, FASTSlider } from "@microsoft/fast-components";
import { neutralForegroundRestBehavior } from "@microsoft/fast-components";

FASTDesignSystemProvider;
FASTSwitch;

/**
 * There is already an issue in place to allow associating a color recipe (like the neutralLayerL1Behavior)
 * as the drawn background of the fast-design-system-provider element. When that goes in the scenario gets much more simple,
 * just set the behavior and set the baseLayerLuminance.
 * 
 * Until that work goes in though, we need to do something like the below.
 */
document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        const designSystemProvider = document.querySelector("fast-design-system-provider");
        const themeSwitch = document.querySelector("fast-slider");

        if (designSystemProvider instanceof FASTDesignSystemProvider) {
            /* #1 and #2 will be un-necessary after next publish */
            /* #1 */ designSystemProvider.registerCSSCustomProperty(neutralForegroundRestBehavior);
            /* #2 */ designSystemProvider.style.setProperty("color", `var(--${neutralForegroundRestBehavior.name})`);

            // Tells the design-system-provider to create the layer CSS custom property
            designSystemProvider.registerCSSCustomProperty(neutralLayerL1Behavior);
            // Tells the design-system-provider to use the above as the CSS background for the region
            designSystemProvider.style.setProperty("background-color", `var(--${neutralLayerL1Behavior.name})`);
            // Set the background *property* to the value of the product of the recipe, for other recipes to use
            designSystemProvider.backgroundColor = (neutralLayerL1Behavior.value as (designSystem: any) => string)(designSystemProvider.designSystem);

            if (themeSwitch instanceof FASTSlider) {
                themeSwitch.addEventListener("change", (e) => {
                    // When the "baseLayerLuminosity" changes, set the new value
                    designSystemProvider.baseLayerLuminance = parseFloat((e.target as FASTSlider).value);
                    // Re-evaluate the layer recipe and set the backgroundColor *property* to the result
                    designSystemProvider.backgroundColor = (neutralLayerL1Behavior.value as (designSystem: any) => string)({...designSystemProvider.designSystem});
                });
            }
        }
    }
});