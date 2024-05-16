<script>
  import { onMount } from 'svelte';
  import ApiConverter from './ApiConverter';
  

  let currencies = [];
  let fromCurrency = '';
  let toCurrency = '';
  let conversionRate = 1;
  let amountFrom = '';
  let amountTo = '';
  

  
  async function fetchCurrencies() {
    const data = await ApiConverter.getCurrenciesNames()
    currencies = data.supported_codes
  }

  const onCurrencyChange = async (exchangeType) => { // exchangeType: "from" | "to"
    if (!fromCurrency || !toCurrency) return
    const data = await ApiConverter.getPairConversion(fromCurrency, toCurrency)
    conversionRate = data.conversion_rate
    if (amountFrom && exchangeType === 'from') {
      recalculateFrom()
    } else if (amountTo && exchangeType === 'to') {
      recalculateTo()
    }
  }

  const recalculateFrom = () => {
    amountTo = String((Number(amountFrom) * conversionRate).toFixed(3))
  }

  const recalculateTo = () => {
    amountFrom = String((Number(amountTo) / conversionRate).toFixed(3))
  }

  onMount(() => {
    fetchCurrencies();
  });
</script>

<style>
  .selector-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .selector {
    margin: .3rem;
    position: relative;
  }
  .selector label {
    position: absolute;
    left: -30px;
  }

  .currency-wrapper {
    display: flex;
  }

  .currency-input {
    margin-left: .4rem;
  }
</style>


<h1>Конвертер валют</h1>

<div class="selector-wrapper">
  <div class="selector">
    <label for="fromCurrency">Из:</label>
    <select id="fromCurrency" bind:value={fromCurrency} on:change={() => onCurrencyChange('from')}>
      {#each currencies as currency}
        <option value={currency[0]}>{currency[0]}, {currency[1]}</option>
      {/each}
    </select>
  </div>


  <div class="selector">
    <label for="toCurrency">В:</label>
    <select id="toCurrency" bind:value={toCurrency} on:change={() => onCurrencyChange('to')}>
      {#each currencies as currency}
        <option value={currency[0]}>{currency[0]}, {currency[1]}</option>
      {/each}
    </select>
  </div>
</div>


{#if fromCurrency && toCurrency}
<div class="currency-wrapper">
  <div class="currency-input">
    <label for="amount">{fromCurrency}:</label>
    <input type="number" id="amount" bind:value={amountFrom} on:input={recalculateFrom} step="1">
  </div>

  <div class="currency-input">
    <label for="amount">{toCurrency}:</label>
    <input type="number" id="amount" bind:value={amountTo} step="1" on:input={recalculateTo}>
  </div>
</div>
{/if}

