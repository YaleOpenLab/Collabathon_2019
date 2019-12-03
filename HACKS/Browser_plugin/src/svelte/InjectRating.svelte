<script>
  import { miniWhiteMapSVG, bigGreenMapSVG } from '../js/svgs.js'

  export let
    sustainabilityScore = 4,
    cost = 3,
    name = "Peanut Butter",
    carbonAmount = '1'
  
  let showModal = false;

  const onMouseOver = (event) => {
    console.log("Moused over climate rating");
    showModal = true;
  }

  const onMouseOut = (event) => {
    console.log("Moused away from climate rating");
    showModal = false;
  }
</script>

<div id="ratingNode" on:mouseenter={onMouseOver} on:mouseleave={onMouseOut}>
  <i id="mapIcon">{@html miniWhiteMapSVG}</i>
  <div id="rating">{sustainabilityScore}</div>
  <div id="climateText">Climate Rating ></div>

  {#if showModal}
    <div id="modalPopup">
      <i id="modalGlobe">{@html bigGreenMapSVG}</i>
      <h1 id="productName">{name.toUpperCase()}</h1>

      <div id="divider"></div>

      <h1 id="titleWidget">Carbon</h1>
      <div id="measurementContainer">
        <div id="amount">{carbonAmount} gCO2e</div>
        <div id="measurement"></div>
      </div>

      <div id="divider"></div>

      <h1 id="titleWidget">Cost</h1>
      <div id="measurementContainer">
        <div id="amount">{cost} US$</div>
        <div id="measurement"></div>
      </div>

      <div id="divider"></div>

      <h1 id="titleWidget">Sustainability</h1>
      <div id="measurementContainer">
        <div id="amount">{sustainabilityScore}</div>
        <div id="measurement"></div>
      </div>

    </div>
  {/if}
</div>

<style>
  #ratingNode {
    padding: 5px;
    border-radius: 15px;
    align-content: center;
    display: flex;
    align-items: center;
    width: 160px;
    height: 35px;
    white-space: nowrap;
    color: White;
    background: #2a6355;
  }

  #mapIcon {
    padding-right: 10px;
  }

  #rating {
    border-style: solid;
    border-width: thin;
    padding: 2px;
    margin-right: 10px;
  }

  #climateText {
    font-size: 12px;
    font-weight: 600;
  }

  #productName {
    color: #2a6355;
    font-size: 14px;
  }

  #modalPopup {
    color: black;
    background-color: white;
    position: relative;
    left: 7px;
    border: solid;
    border-width: thin;
    border-color: #e8ebe8;
    border-radius: 20px;
    padding: 20px;
    flex-direction: column;
    width: 200px;
    z-index: 100;
  }

  #divider {
    height: 1px;
    margin-bottom: 15px;
    margin-top: 15px;
    background-color: lightgray;
  }

  #titleWidget {
    font-size: 16px;
    color: black;
    font-weight: 300;
  }

  #measurementContainer {
    color: #2a6355;
  }

  #measurement {
    font-size: 13px;
  }

  #amount {
    font-size: 28px;
  }
</style>