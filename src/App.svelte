<script lang="ts">
  import Table from './Table.svelte';
  import type {ScoutField} from './types';
  import {mydata} from './stores/scoutstore';
  import type {Heading} from './headingtype';

  const getGrowers = () => [
    'G1', 'G2', 'G3', 'G4', 'G5'
  ];

  const getScouts = () => [
    'S1', 'S2', 'S3', 'S4', 'S5'
  ];

  const headings: Heading[] = [
    {title: 'Scout', property: 'scoutName', getOptions: getScouts, width: 75},
    {title: 'Grower', property: 'growerName', getOptions: getGrowers, width: 75},
    {title: 'Field', property: 'fieldName', width: 200},
    {title: 'Acres', property: 'acres', type: 'number', width: 100}
  ];

  function insertRowAfter(event) {
    let index=event.detail.index;
    const item: ScoutField = {
      scoutName: '',
      growerName: '',
      fieldName: '',
      acres: 0
    };
    $mydata.splice(index + 1, 0, item);
    $mydata = $mydata;
  }

</script>

<main>
  <h1>Next 7 Days</h1>
  <Table {headings} bind:data={$mydata} on:addnewrow={insertRowAfter} />
</main>
Debug
<p>{JSON.stringify($mydata)}</p>

<style>
</style>
