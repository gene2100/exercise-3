import { AfterViewInit, Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as go from 'gojs';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-table-diagram',
  templateUrl: './table-diagram.component.html',
  styleUrls: ['./table-diagram.component.css']
})
export class TableDiagramComponent implements OnInit, AfterViewInit {

  public diagram: go.Diagram;

  public tableCount: number = 2;

  makeButton(text, action) {
    return $("ContextMenuButton",
      $(go.TextBlock, text),
      { click: action },
      // // don't bother with binding GraphObject.visible if there's no predicate
      // visiblePredicate ? new go.Binding("visible", "", (o, e) => o.diagram ? visiblePredicate(o, e) : false).ofObject() : {}
      );
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){

    this.diagram = $(go.Diagram, 'myDiagramDiv',
      {"undoManager.isEnabled": true}
    )

    const contextButtonRow =
    $("ContextMenu",
      this.makeButton("AddrowAbove",
        (e, obj) => {
          let contextMenu = obj.part
          let part = contextMenu.adornedObject
          this.addRow(part.panel.itemIndex)
      }),
      this.makeButton("AddrowBelow",
        (e, obj) => {
          let contextMenu = obj.part
          let part = contextMenu.adornedObject
          this.addRow(part.panel.itemIndex + 1)
      }),
      this.makeButton("RemoveRow",
        (e, obj) => {
          let contextMenu = obj.part
          let part = contextMenu.adornedObject
          this.removeRow(part.panel.itemIndex)
      }),
      )

    const contextButtonColumn =
      $("ContextMenu",
      this.makeButton("AddColumnBefore",
        (e, obj) => {
          let contextMenu = obj.part
          let part = contextMenu.adornedObject
          this.InsertColumn(part.itemIndex)
        }
      ),
      this.makeButton("AddColumnAfter",
        (e, obj) => {
          let contextMenu = obj.part
          let part = contextMenu.adornedObject
          this.InsertColumn(part.itemIndex + 1)
        }
      ),
      this.makeButton("RemoveColumn",
        (e, obj) => {
          let contextMenu = obj.part
          let part = contextMenu.adornedObject
          this.DeleteSelectColumn(part.itemIndex)
        }
      )
      )

      const contextButtonLink =
        $("ContextMenu",
        this.makeButton("One to One",
          (e, obj) => {
            this.setLinkRel("One to One")
          }
          ),this.makeButton("One to Many",
          (e, obj) => {
            this.setLinkRel("One to Many")
          }
          ),this.makeButton("Many to One",
          (e, obj) => {
            this.setLinkRel("Many to One")
          }
          ),this.makeButton("Many to Many",
          (e, obj) => {
            this.setLinkRel("Many to Many")
          }
          ),this.makeButton("Delete",
          (e, obj) => {
            this.DeleteLink()
          }
          )
        )

    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, { fill: "white" }),
        $(go.Panel, "Table", new go.Binding("itemArray", "people"),
        { defaultRowSeparatorStroke: "black",
        defaultColumnSeparatorStroke: "black" },
        $(go.Panel,"TableRow", new go.Binding("itemArray", "columnDefinitions"), { isPanelMain: true },
          {itemTemplate:
            $(go.Panel, {stretch: go.GraphObject.Fill, background: "lightgray"},
              new go.Binding("column"),
              {
                doubleClick: (e, item) => {
                  this.openDialog(item.findBindingPanel())
                },
                contextMenu: contextButtonColumn
              },
              $(go.TextBlock, "Auto",
                { margin: new go.Margin(15, 15, 15, 15), font: "bold 10pt sans-serif" },
                new go.Binding("text"))
            )
          }
        ),
        {
          name: "TABLE",
          itemTemplate:
            $(go.Panel, "TableRow",
              new go.Binding("itemArray", "columns"),
              {
                itemTemplate:
                  $(go.Panel, {stretch: go.GraphObject.Fill, background: "transparent"},
                    new go.Binding("column"),
                    {
                      doubleClick: (e, item) => {
                        this.openDialog(item.findBindingPanel())
                      },
                      contextMenu: contextButtonRow
                    },
                  $(go.TextBlock, {margin: new go.Margin(15, 15, 15, 15)},
                    new go.Binding("text").makeTwoWay())
                  )
              }
            ),
        }
      ),
      $(go.Shape,"Rectangle", {height: 8, width: 8, angle: 180, portId: "Link", alignment: new go.Spot(1,0,-2,2), fill:"#0d6efd", stroke:"lightgray",fromLinkable: true, toLinkable: true}),
      )

    this.diagram.linkTemplate = $(go.Link, {contextMenu: contextButtonLink},
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, new go.Binding("text", "rel"), {segmentOffset: new go.Point(0,-12), segmentOrientation: go.Link.OrientAlong})
    );

    this.diagram.model = new go.GraphLinksModel({
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: [
        {
          key : 1,
          columnDefinitions: [
            { text: "Name", column: 0 },
            { text: "Phone #", column: 1 },
            { text: "Office", column: 2 }
          ],
          people: [
            { columns: [{ column: 0, text: "Alice" }, { column: 1, text: "2345" }, { column: 2, text: "" }] },
            { columns: [{ column: 0, text: "Bob" }, { column: 1, text: "9876" }, { column: 2, text: "E1-B34" }] },
            { columns: [{ column: 0, text: "Carol" }, { column: 1, text: "1111" }, { column: 2, text: "C4-E23" }] },
            { columns: [{ column: 0, text: "Ted" }, { column: 1, text: "2222" }, { column: 2, text: "C4-E197" }] }
          ]
        },
        { // second node
          key: 2,
          columnDefinitions: [
            {text: "Name", column: 0 },
            {text: "Phone #", column: 1 },
            {text: "Office", column: 2 }
          ],
          people: [
            { columns: [{column: 0, text: "Robert" }, { column: 1, text: "5656" }, { column: 2, text: "B1-A27" }] },
            { columns: [{column: 0, text: "Natalie" }, { column: 1, text: "5698" }, { column: 2, text: "B1-B6" }] }
          ]
        }
      ],
      linkDataArray: [
        { from: 1, to: 2, rel: "One to Many" }
      ]
    }
    )
  }

  addTable(){
    this.tableCount++;
    this.diagram.startTransaction("addTable")
    this.diagram.model.addNodeData({
      key : this.tableCount,
      columnDefinitions: [
      { text: "Doubleclick to Edit", column: 0 },
    ],
    people: [
      { columns: [{ column: 0, text: "Doubleclick to Edit" }]},
    ]
  })
  this.diagram.commitTransaction("addTable")
  }

  addRow(rowIndex : number){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    let data = selectedTable.data;
    let newRow = {columns: []}
    for (let i = 0; i < data.columnDefinitions.length; i++){
      newRow.columns.push({column: i, text: ""})
    }
    this.diagram.startTransaction("addRow")
    this.diagram.model.insertArrayItem(data.people, rowIndex, newRow)
    this.diagram.commitTransaction("addRow")
  }

  addColumn(){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    let data = selectedTable.data;
    let col = data.columnDefinitions.length
    this.diagram.startTransaction("addColumn")
    this.diagram.model.addArrayItem(data.columnDefinitions, {text: "Default", column: col})
    for(let i = 0; i < data.people.length; i++){
      this.diagram.model.addArrayItem(data.people[i].columns,{column: col,text: ""})
    }
    this.diagram.commitTransaction("addColumn")
  }
  removeTable(){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    this.diagram.startTransaction("removeTable")
    this.diagram.remove(selectedTable)
    this.diagram.commitTransaction("removeTable")
  }

  removeRow(rowIndex : number){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    let data = selectedTable.data;
    this.diagram.startTransaction("removeRow")
    this.diagram.model.removeArrayItem(data.people, rowIndex)
    this.diagram.commitTransaction("removeRow")
  }

  removeColumn(){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    let data = selectedTable.data;
    if (data.columnDefinitions.length === 1) return;
    this.diagram.startTransaction("removeColumn")
    this.diagram.model.removeArrayItem(data.columnDefinitions, -1)
    for(let i = 0; i < data.people.length; i++){
      this.diagram.model.removeArrayItem(data.people[i].columns, -1)
    }
    this.diagram.commitTransaction("removeColumn")
  }

  InsertColumn(colIndex : number){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    let data = selectedTable.data;
    this.diagram.startTransaction("insertColumn")
    this.diagram.model.insertArrayItem(data.columnDefinitions, colIndex, {text: "Default", column: colIndex})
    for(let i = colIndex + 1; i < data.columnDefinitions.length; i++){
      this.diagram.model.setDataProperty(data.columnDefinitions[i], "column", i)
    }
    for(let row = 0 ; row < data.people.length; row++){
      this.diagram.model.insertArrayItem(data.people[row].columns, colIndex, {column: colIndex, text: ""})
      for(let col = colIndex + 1; col < data.people[row].columns.length; col ++ ){
        this.diagram.model.setDataProperty(data.people[row].columns[col], "column", col)
      }
    }
    this.diagram.model.commitTransaction("insertColumn")
  }

  DeleteSelectColumn(colIndex : number){
    let selectedTable = this.diagram.selection.first()
    if (selectedTable === null) return;
    let data = selectedTable.data;
    if (data.columnDefinitions.length === 1){
      alert("Cannot delete last column in the table")
      return;
    }
    this.diagram.startTransaction("deleteSelectColumn")
    this.diagram.model.removeArrayItem(data.columnDefinitions, colIndex)
    for(let i = colIndex; i < data.columnDefinitions.length; i++){
      this.diagram.model.setDataProperty(data.columnDefinitions[i], "column", i)
    }
    for(let row = 0 ; row < data.people.length; row++){
      this.diagram.model.removeArrayItem(data.people[row].columns, colIndex)
      for(let col = colIndex; col < data.people[row].columns.length; col ++ ){
        this.diagram.model.setDataProperty(data.people[row].columns[col], "column", col)
      }
    }
    this.diagram.commitTransaction("deleteSelectColumn")
  }

  openDialog(tablePanel: go.Panel): void{
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '500px',
      data: tablePanel.data.text
    });

    dialogRef.afterClosed().subscribe(result => {
      this.diagram.startTransaction("editValue")
      this.diagram.model.setDataProperty(tablePanel.data, "text", result)
      this.diagram.commitTransaction("editValue")
    })
  }

  setLinkRel(rel: string){
    let selectedLink = this.diagram.selection.first()
    if (selectedLink === null) return;
    let data = selectedLink.data;
    this.diagram.startTransaction('setRel')
    this.diagram.model.setDataProperty(data, "rel", rel)
    this.diagram.commitTransaction('setRel')
  }

  DeleteLink(){
    let selectedLink = this.diagram.selection.first()
    if (selectedLink === null) return;
    this.diagram.startTransaction('DeleteLink')
    this.diagram.remove(selectedLink)
    this.diagram.commitTransaction('DeleteLink')
  }
}

