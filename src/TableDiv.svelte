<script lang="ts">
  import {onMount} from 'svelte';
  import type {Heading} from './headingtype'
  import { createEventDispatcher } from 'svelte';
  import {flip} from 'svelte/animate';
  let hovering = -1;
  
  const dispatch = createEventDispatcher();
  function handlenewrow(index) {        
        dispatch('addnewrow', {
          index:index
        });  
  }


  export let data: any;
  export let headings: Heading[];


  // Support for drag and drop of table rows was heavily inspired by
  // https://htmldom.dev/drag-and-drop-table-row/

  let editIndex: number;
  let editProperty: string;
  let tablediv: HTMLDivElement;



  function deleteRow(index: number): void {
    data.splice(index, 1);
    data = data;
    dispatch('deleterow', {
          index:index
      });      
    
  }

  function editCell(index: number, property: string): void {
    console.log(index, property);
    editIndex = index;
    editProperty = property;
  }

  function getStyle(heading: Heading) {
    const {width} = heading;
    return width ? `width: ${width}px` : '';
  }

  const handleBlur = (event: FocusEvent) => editProperty = '';

  function handleKey(event: KeyboardEvent): void {
    const {code} = event;
    if (code === 'Enter' || code === 'Escape') editProperty = '';
  }

  // function insertRowAfter(index: number): void {
  //   const item: ScoutField = {
  //     scoutName: '',
  //     growerName: '',
  //     fieldName: '',
  //     acres: 0
  //   };
  //   data.splice(index + 1, 0, item);
  //   data = data;
  // }

  function isAbove(nodeA: Element, nodeB: Element): boolean {
    // Get the bounding rectangle of nodes.
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  }


  function saveChange(event, index: number, property: string): void {
    data[index][property] = event.target.value;
    data = data;
    if (event.target.nodeName === 'SELECT') editProperty = '';
  }

  const selectAll = (input: HTMLInputElement) => input.select();


  const drop = (event, target) => {
    console.log(event);
    event.dataTransfer.dropEffect = 'move'; 
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newTracklist = data

    if (start < target) {
      console.log("element before zero i think");
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      console.log('somewher in the middle');
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }
    data = newTracklist
    hovering = null
  }  
  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  }  
</script>

<section>
  <div id="table"  bind:this={tablediv}>
    <div class="tr">
      <div class="td">Drag</div>
      {#each headings as heading}
        <div style={getStyle(heading)} class="td">{heading.title}</div>
      {/each}
      <div class="td">Actions</div>
    </div>
    {#each data as obj, index (obj)}        
      <div class="tr" 
        animate:flip 
        draggable={true} 
        on:dragstart={event => dragstart(event, index)}
        on:drop|preventDefault={event => drop(event, index)}
        ondragover="return false"
        on:dragenter={() => hovering = index}
        class:is-active={hovering === index}>
        <div class="drag td">
          ☰
        </div>
          {#each headings as heading}
            <div on:dblclick={() => editCell(index, heading.property)} class="td">
              {#if editIndex === index && editProperty === heading.property}
                {#if heading.getOptions}
                  <select
                    on:blur={e => saveChange(e, index, heading.property)}
                    on:change={e => saveChange(e, index, heading.property)}
                    value={obj[heading.property]} on:change>
                    {#each heading.getOptions() as option}
                      <option value={option}>{option}</option>
                    {/each}
                  </select> 
                {:else}   
                  <input
                  on:blur={handleBlur}
                  on:keydown={handleKey}
                  style={getStyle(heading)}
                  type={heading.type}
                  use:selectAll
                  on:change={e => saveChange(e, index, heading.property)}
                  value={data[index][heading.property]} on:change>

                {/if}     
              {:else}<span>{obj[heading.property]}</span>{/if}  
            </div>
          {/each} <!-- each header -->
        <div class="actions td" >
          <button on:click={() => deleteRow(index)} title="delete">✖🗑</button>
          <button
            on:click={() => handlenewrow(index)}
            title="insert after">➕</button>
        </div> 
      </div>    
    {/each} <!-- each data -->     


  </div>
</section>










<style>

  #table{
    display: table;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);    
  }
  .tr{
    display: table-row;
    
  }
  .td{
    display: table-cell;
    border: 1px solid lightgray;
    padding: 0.5rem;   

  } 
  .tr:not(:last-child) {
    border-bottom: 1px solid #dbdbdb;
  }
  .tr.is-active {
    background-color: #3273dc;
    color: #fff;
  }

  .actions button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-bottom: 0;
    padding: 0 6px;
  }

  .drag {
    text-align: center;
  }

  input,
  select {
    margin-bottom: 0;
  }


  section :global(.draggable) {
    cursor: ns-resize;
    user-select: none;
  }

  section :global(.dragging) {
    background: white;
    z-index: 999; /* probably don't need this */
  }

  section :global(.placeholder) {
    --border-width: 2px;
    --fudge: 3px;
    background-color: #edf2f7;
    border: var(--border-width) dashed #cbd5e0;
    height: calc(var(--row-height) - 2 * var(--border-width) - var(--fudge));
  }


  section :global(.clone-list) {
    border-top-width: 0;
  }

  section :global(.dragging) {
    border-top-width: 1px;
  }


 



</style>
