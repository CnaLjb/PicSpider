

//链节点数据结构  
export class QNode{  

    public data:string;

    public next:QNode;

    constructor(data:string,next:QNode=null){
        this.data = data;
        this.next = next;
    }
}

//链表类
export  class LinkQueue{

    //队列头指针  
    private front:QNode;  
    //队列尾指针  
    private rear:QNode;  
    //队列长度  
    private size:number = 0;


    constructor(){
        this.front = this.rear = null;
    }


    /**弹出队列头结点 */
    public popup(){
        var head = this.front;
        if(head){
            this.front = this.front.next;
            this.size--;
            /**切断返回节点与队列的联系 */
            head.next = null;
        }
        return head;
    }

    /**为队列添加节点 */
    public push(url?:string,node?:QNode){
        var node:QNode;
        if(url &&　!node){
            node = new QNode(url);
        }
        if(this.rear != null){
            this.rear.next = node;
        }
        this.rear = node;
        this.size++;                
    }

    /**
     * 获取队列长度
     */
    public getSize(){
        return this.size;
    }
}