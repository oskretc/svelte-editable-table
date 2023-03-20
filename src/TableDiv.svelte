<script lang="ts">
  import {onMount} from 'svelte';
  import type {Heading} from './headingtype'
  import { createEventDispatcher } from 'svelte';
  import {flip} from 'svelte/animate';
  let hovering = false;
  
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

  let draggingEl: HTMLTableRowElement;
  let draggingRowIndex: number;
  let editIndex: number;
  let editProperty: string;
  let isDraggingStarted = false;
  let list: HTMLDivElement;
  let placeholder: HTMLDivElement;
  let table: HTMLTableElement;
  let tablediv: HTMLDivElement;

  // holds current position of mouse relative to dragging element
  let x = 0;
  let y = 0;

  // function cloneTable() {
  //   const rect = table.getBoundingClientRect();
  //   const width = parseInt(window.getComputedStyle(table).width);

  //   list = document.createElement('div');
  //   list.classList.add('clone-list');
  //   list.style.position = 'absolute';
  //   list.style.left = `${rect.left}px`;
  //   list.style.top = `${rect.top}px`;
  //   table.parentNode.insertBefore(list, table);

  //   // Hide the original table.
  //   table.style.visibility = 'hidden';

  //   for (const row of table.querySelectorAll('tr')) {
  //     // Create a new table from given row.
  //     const item = document.createElement('div');
  //     item.classList.add('draggable');

  //     const newTable = document.createElement('table');
  //     newTable.setAttribute('class', 'clone-table');
  //     newTable.style.width = `${width}px`;

  //     const newRow = document.createElement('tr');
  //     for (const cell of row.children) {
  //       const newCell = cell.cloneNode(true) as HTMLTableCellElement;
  //       newCell.style.width = `${parseInt(
  //         window.getComputedStyle(cell).width
  //       )}px`;
  //       newRow.appendChild(newCell);
  //     }

  //     newTable.appendChild(newRow);
  //     item.appendChild(newTable);
  //     list.appendChild(item);
  //   }
  // }

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

  // function mouseDownHandler(e: MouseEvent): void {
  //   // Get table row containing target.
  //   const target = e.target as Element;
  //   let originalRow = target.parentNode;
  //   while (originalRow.nodeName !== 'TR') {
  //     originalRow = originalRow.parentNode;
  //   }

  //   const trs = Array.from(table.querySelectorAll('tr'));
  //   draggingRowIndex = trs.indexOf(originalRow as HTMLTableRowElement);

  //   // Determine mouse position.
  //   x = e.clientX;
  //   y = e.clientY;

  //   // Attach the listeners to document.
  //   document.addEventListener('mousemove', mouseMoveHandler);
  //   document.addEventListener('mouseup', mouseUpHandler);
  // }

  // function mouseMoveHandler(e: MouseEvent): void {
  //   if (!isDraggingStarted) {
  //     isDraggingStarted = true;

  //     cloneTable();

  //     draggingEl = list.children.item(draggingRowIndex) as HTMLTableRowElement;
  //     draggingEl.classList.add('dragging');

  //     placeholder = document.createElement('div');
  //     placeholder.classList.add('placeholder');
  //     draggingEl.parentNode.insertBefore(
  //       placeholder,
  //       draggingEl.nextSibling
  //     );
  //   }

  //   // Set position for dragging element.
  //   draggingEl.style.position = 'absolute';
  //   draggingEl.style.top = `${draggingEl.offsetTop + e.clientY - y}px`;
  //   draggingEl.style.left = `${
  //     draggingEl.offsetLeft + e.clientX - x
  //   }px`;

  //   // Reassign position of mouse.
  //   x = e.clientX;
  //   y = e.clientY;

  //   // The current order is prevEle, draggingEl, placeholder, nextEle.
  //   const prevEle = draggingEl.previousElementSibling;
  //   const nextEle = placeholder.nextElementSibling;

  //   // If the dragging element is above the previous element
  //   // and the user moves the dragging element to the top,
  //   // don't allow to drop above the header
  //   // (which doesn't have `previousElementSibling`).
  //   if (
  //     prevEle &&
  //     prevEle.previousElementSibling &&
  //     isAbove(draggingEl, prevEle)
  //   ) {
  //     // current order -> new order
  //     // prevEle       -> placeholder
  //     // draggingEl    -> draggingEl
  //     // placeholder   -> prevEle
  //     swapElements(placeholder, draggingEl);
  //     swapElements(placeholder, prevEle);
  //     return;
  //   }

  //   // If the dragging element is below the next element
  //   // and the ser moves the dragging element to the bottom ...
  //   if (nextEle && isAbove(nextEle, draggingEl)) {
  //     // current order -> new order
  //     // draggingEl    -> nextEle
  //     // placeholder   -> placeholder
  //     // nextEle       -> draggingEl
  //     swapElements(nextEle, placeholder);
  //     swapElements(nextEle, draggingEl);
  //   }
  // }

  // function mouseUpHandler(): void {
  //   if (!placeholder) return; // not dragging

  //   // Remove placeholder.
  //   if (placeholder) placeholder.parentNode.removeChild(placeholder);

  //   draggingEl.classList.remove('dragging');
  //   draggingEl.style.removeProperty('top');
  //   draggingEl.style.removeProperty('left');
  //   draggingEl.style.removeProperty('position');

  //   const endRowIndex = Array.from(list.children).indexOf(draggingEl);

  //   isDraggingStarted = false;

  //   // Remove list element.
  //   list.parentNode.removeChild(list);

  //   // Move dragged row to endRowIndex.
  //   const rows = Array.from(table.querySelectorAll('tr'));
  //   draggingRowIndex > endRowIndex
  //     ? rows[endRowIndex].parentNode.insertBefore(
  //         rows[draggingRowIndex],
  //         rows[endRowIndex]
  //       )
  //     : rows[endRowIndex].parentNode.insertBefore(
  //         rows[draggingRowIndex],
  //         rows[endRowIndex].nextSibling
  //       );

  //   // Bring back the table.
  //   table.style.removeProperty('visibility');

  //   // Remove handlers of mousemove and mouseup.
  //   document.removeEventListener('mousemove', mouseMoveHandler);
  //   document.removeEventListener('mouseup', mouseUpHandler);
  // }

  function saveChange(event, index: number, property: string): void {
    data[index][property] = event.target.value;
    data = data;
    if (event.target.nodeName === 'SELECT') editProperty = '';
  }

  const selectAll = (input: HTMLInputElement) => input.select();

  // function swapElements(elementA: Element, elementB: Element) {
  //   const siblingA =
  //     elementA.nextSibling === elementB ? elementA : elementA.nextSibling;

  //   // Move elementA to before the elementB.
  //   elementB.parentNode.insertBefore(elementA, elementB);

  //   // Move elementB to before the sibling of elementA.
  //   elementA.parentNode.insertBefore(elementB, siblingA);
  // }

  // onMount(() => {
  //   table.querySelectorAll('tr').forEach((row, index: number) => {
  //     // Ignore the header so the user cannot move it.
  //     if (index === 0) return;

  //     // Allow dragging only by first cell of each row.
  //     const firstCell = row.firstElementChild;
  //     firstCell.classList.add('draggable');
  //     firstCell.addEventListener('mousedown', mouseDownHandler);
  //   });
  // });


  const drop = (event, target) => {
    console.log(event);
    event.dataTransfer.dropEffect = 'move'; 
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newTracklist = list

    if (start < target) {
      console.log("element before zero i think");
      // newTracklist.splice(target + 1, 0, newTracklist[start]);
      // newTracklist.splice(start, 1);
    } else {
      console.log('somewher in the middle');
      // newTracklist.splice(target, 0, newTracklist[start]);
      // newTracklist.splice(start + 1, 1);
    }
    list = newTracklist
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
    border: 1px solid purple;
    padding: 0.5rem;   

  }

  .tr-item {
    display: block;
    padding: 0.5em 1em;
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

  section {
    --row-height: 52px;
  }

  section :global(.clone-table),
  section :global(table) {
    border-collapse: collapse;
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

  section :global(td),
  section :global(th) {
    border: 1px solid lightgray;
    padding: 0.5rem;
  }
  .theader {
    border: 1px solid lightgray;
    padding: 0.5rem;
  }  

  section :global(.clone-list td) {
    border-top-width: 0;
  }

  section :global(.dragging td) {
    border-top-width: 1px;
  }

  section :global(tr) {
    height: var(--row-height);
  }
 



</style>
