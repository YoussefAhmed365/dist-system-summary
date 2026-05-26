export type TopicItem = {
  text: string;
  subItems?: string[];
};

export type ContentBlock = {
  type: 'text' | 'bullet_list' | 'arabic' | 'visual' | 'snippet' | 'interactive';
  content?: string;
  items?: TopicItem[];
  id?: string;
};

export type Topic = {
  title: string;
  blocks: ContentBlock[];
};

export type Chapter = {
  id: string;
  title: string;
  topics: Topic[];
  audioUrl?: string; // Path to the audio file for this chapter
};

export const SYLLABUS: Chapter[] = [
  {
    id: 'Chapter 1',
    title: 'High-Performance Distributed Computing Systems (Types of Architectures)',
    audioUrl: '/audio/chapter1.m4a',
    topics: [
      {
        title: '1. Cluster Computing',
        blocks: [
          { type: 'text', content: 'Consists of a group of high-end systems connected through a Local Area Network (LAN).' },
          {
            type: 'bullet_list', items: [
              { text: 'Homogeneous: Clusters have near-identical hardware running the same OS.' },
              {
                text: 'Uses a single managing node (Master Node) that:', subItems: [
                  'Handles allocation of nodes to parallel programs.',
                  'Maintains a batch queue of submitted jobs.',
                  'Provides a User Interface (UI).'
                ]
              }
            ]
          },
          { type: 'text', content: 'Compute Nodes\nThey are processing units running a standard OS extended with middleware to handle communication, storage, & reliability.' },
          { type: 'text', content: 'Compute Nodes: Standard OS + Middleware (Communication + storage + Fault Tolerance)' }
        ]
      },
      {
        title: '2. Grid Computing',
        blocks: [
          { type: 'text', content: 'Connecting a massive number of nodes from various locations.' },
          {
            type: 'bullet_list', items: [
              { text: 'Heterogeneous: Systems are composed of several types of hardware & Software and dispersed across multiple organizations.' },
              { text: 'Scale: Can easily span across a Wide-Area Network (WAN).' },
              {
                text: 'Architecture Layers:', subItems: [
                  '1. Fabric: Provides an interface to local resources.',
                  '2. Connectivity: Handles communication, transaction, & authentication protocols.',
                  '3. Resource: Manages a single resource, such as creating a process/reading data.',
                  '4. Collective: Handles access to multiple resources simultaneously.',
                  '5. Application: Contains the actual grid applications in a single organization.'
                ]
              }
            ]
          },
          { type: 'visual', id: 'grid-architecture' }
        ]
      },
      {
        title: '3. Cloud Computing',
        blocks: [
          { type: 'text', content: 'An internet-based, service-oriented model structured as a stack of distinct layers.' },
          {
            type: 'bullet_list', items: [
              { text: 'Hardware Layer (Data Centers): Lowest layer, customers don’t see.' },
              {
                text: 'Infrastructure Layer (IaaS): Deploys virtualization to provide customers with virtual storage & computing resources.', subItems: [
                  'Example: Amazon S3, Amazon EC2'
                ]
              },
              {
                text: 'Platform Layer (PaaS): Provides higher-level abstractions & easy ways to develop & deploy apps in the cloud.', subItems: [
                  'Example: Microsoft Azure, Google App Engine'
                ]
              },
              {
                text: 'Application Layer (SaaS): Consists of actual end-user applications.', subItems: [
                  'Example: Office Suits, Google Docs, Gmail, YouTube'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'Chapter 2',
    title: 'Architectures',
    audioUrl: '/audio/chapter2.m4a',
    topics: [
      {
        title: '1. Layered Architecture',
        blocks: [
          { type: 'text', content: 'Each layer provides services to the layer above it & requests services from the layer below it.' },
          { type: 'text', content: '*In this architecture, components are organized hierarchically & communication only happens between adjacent layers, ensuring clean separation of concerns.' },
          { type: 'arabic', content: '* في هذا التصميم، يتم تنظيم المكونات بشكل هرمي ولا يحدث الاتصال إلا بين الطبقات المتجاورة، مما يضمن فصلاً واضحاً للمخاوف.' },
          {
            type: 'bullet_list', items: [
              { text: 'Control Flow: Downcalls/Upcalls.' },
              { text: 'Use Cases: Network Protocols.' }
            ]
          },
          { type: 'text', content: 'Three-Tier:' },
          {
            type: 'bullet_list', items: [
              { text: '1. User Interface (Presentation Layer): Displays data & handles user interaction.' },
              { text: '2. Processing Level (Business Logic Layer): Executes actual application algorithms, validation rules, & data processing.' },
              { text: '3. Data Level (Persistence Layer): The database or file system housing the actual records.' }
            ]
          },
          { type: 'visual', id: 'three-tier' }
        ]
      },
      {
        title: '2. Event-Based Architecture (Publish-Subscribe)',
        blocks: [
          { type: 'text', content: 'Instead of components calling each other directly (synchronous), they communicate asynchronously by producing and consuming events.' },
          { type: 'text', content: 'The Publish-Subscribe (Pub/Sub) Model' },
          {
            type: 'bullet_list', items: [
              {
                text: 'Publisher: An entity that generates an event notification when something noteworthy happens (e.g., "User Created", "Payment Processed").', subItems: [
                  'It doesn’t know who will receive that event, or even if anyone is listening at all.'
                ]
              },
              { text: 'Subscriber: An entity that registers its interest in specific event types with the event broker.' }
            ]
          },
          { type: 'visual', id: 'pub-sub' }
        ]
      },
      {
        title: '3. Middleware Architecture',
        blocks: [
          { type: 'text', content: 'Acts as an abstraction layer between the OS and distributed apps, masking the underlying network complexity.' },
          { type: 'text', content: 'A. Wrapper (Adapter)\nUsed to integrate legacy software into a distributed system by translating incompatible interfaces.' },
          {
            type: 'bullet_list', items: [
              { text: '1-on-1: Every app gets a specific wrapper. [Complexity: O(n²)]' },
              { text: 'Central Broker: Centralized wrapper management. [Complexity: O(n)]' }
            ]
          },
          { type: 'visual', id: 'wrapper' },
          { type: 'text', content: 'B. Interceptor\nA software construct that breaks the normal execution flow of the middleware, allowing developers to inject custom application-specific code to execute.' },
          {
            type: 'bullet_list', items: [
              { text: 'Request-Level Interceptors: Act as middlemen for high-level function calls, managing application-specific tasks like transparently replicating requests to backup servers.' },
              { text: 'Message-Level Interceptors: Operate at the lower transport tier, handling raw, serialized network data streams to perform network-focused tasks like payload fragmentation, compression, or encryption without knowing the underlying application methods.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'Chapter 3',
    title: 'Logical Time & Global State',
    audioUrl: '/audio/chapter3.m4a',
    topics: [
      {
        title: 'Logical Time & The Relation Between Two Events',
        blocks: [
          { type: 'text', content: 'Why Logical Time? In a Distributed System, it’s impossible to synchronize physical clocks across all machines.' },
          { type: 'text', content: 'The Happened-Before Relation (→)' },
          { type: 'arabic', content: 'b حصل قبل a دا معناه أن الحدث :(b → a) لما نكتب\n:(b → a)في ثلاث شروط لازم تتحقق عشان نقدر نقول\n1. a → b ، فإن b حصل قبل a ضمن نفس العملية والحدث b و a قاعدة نفس العملية: الحدثين\n2. هو حدث استلام نفس الرسالة من قِبل عملية b هو حدث إرسال رسالة من قِبل عملية ما، وكان a قاعدة الرسائل: إذا كان a → b أخرى، فإن\n3. a → c ، فإن c → b و b → a قاعدة التعدي: إذا كان' },
          {
            type: 'bullet_list', items: [
              { text: '1. Same Process Rule: If a and b are events within the same process, and a occurs before b, then a → b.' },
              { text: '2. Message Rule: If a is the event of sending a message by one process, and b is the event of receiving that same message by another process, then a → b.' },
              { text: '3. Transitive Rule: If a → b and b → c, then a → c.' }
            ]
          },
          { type: 'visual', id: 'happened-before' }
        ]
      },
      {
        title: 'Concurrent Events ( ∥ )',
        blocks: [
          { type: 'text', content: 'If two distinct events x and y occur in different processes, and neither casually leads to the other (meaning x ↛ y and y ↛ x), the events are concurrent (x ∥ y).' }
        ]
      },
      {
        title: 'Scalar Clocks vs. Vector Clocks',
        blocks: [
          {
            type: 'bullet_list', items: [
              {
                text: 'Scalar Clocks (Lamport Clocks): Represent first attempt of translating "Happened-Before" logic into actual computer code using simple increasing integer counter.', subItems: [
                  'Every process keeps its own single counter (Ci), which acts as its local logical clock.',
                  'o Rule 1 (Internal Event): Before any execution, process tick its clock by one (Ci = Ci + 1)',
                  'o Rule 2 (Receiving a Message): When process receives a message with timestamp tm, it updates by (Ci = max(Ci, tm) + 1).',
                  'Limitations: (No Strong Consistency): If C(a) < C(b), we can\'t guarantee that a → b. They might be concurrent events.'
                ]
              }
            ]
          },
          { type: 'arabic', content: 'الـ Scalar Clocks دي طريقة قديمة بتاعت واحد اسمه Lamport فكرتها الأساسية كل جهاز (Process) في السستم بيمشي وفي جيبه عدّاد رقمي صحيح (Integer Counter) بيبدأ من الصفر.\nقوانين الحركة والزيادة:\n• حدث داخلي: أول ما الجهاز يعمل أي حاجة جواه (زي تعديل بيانات)، يروح مزوّد عدّاده +1.\n• إرسال رسالة: وهو بيبعت رسالة لجهاز تاني، بيلزق عليها قيمة عدّاده الحالي.\n• استقبال رسالة: الجهاز اللي بيستقبل بيبص على الساعة اللي جاية مع الرسالة، وبيقارنها بساعته المحلية، وياخد الرقم الكبير فيهم ويقفل عليه ويزوّد +1.\nالعيب القاتل (فخ الامتحان): الساعة دي بتمشي في اتجاه واحد بس. يعني لو حدث a سبب في حدوث b، فأكيد ساعة a هتكون أصغر من b. لكن العكس مش صحيح! لو لقيت ساعتين واحدة أصغر من التانية، ما تقدرش تحلف إنهم سبب في بعض، ممكن يكونوا حصلوا في نفس الوقت (Concurrent) والساعة مش قادرة تلمح ده.' },
          {
            type: 'bullet_list', items: [
              {
                text: 'Vector Clocks: Instead of maintaining one single integer, each process keeps a vector representing its current knowledge of the logical time at all processes in entire system, such: [2, 0, 0].', subItems: [
                  'o Rule 1 (Internal Event): Process marks its slot in the vector.',
                  'o Rule 2 (Receiving a Message): When receiving a message carrying a vector timestamp, the process merges its current knowledge with the incoming knowledge.',
                  'Advantage: Strong Consistency (Isomorphism) a → b ⟺ VC(a) < VC(b).',
                  'Note: If neither vector is less than another ([2, 1, 0], [1, 2, 0]), we know that events concurrent (a ∥ b).'
                ]
              }
            ]
          },
          { type: 'interactive', id: 'clocks' }
        ]
      },
      {
        title: 'Global States & Cuts (Consistent vs. Inconsistent)',
        blocks: [
          { type: 'text', content: 'Global State: Represents a distributed "snapshot" composed of the individual local states of all processes + the messages currently in transit along communication channels.' },
          { type: 'text', content: 'Cut: is a visual line drawn across a distributed execution diagram that divides all events into two sets: the Past (events occurring before the cut line) and the Future (events occurring after the cut line).' },
          { type: 'text', content: 'Consistent Cut (Valid Global State)\nA cut is consistent if, for every event included in the cut\'s past, all other events that casually happened-before it are also included in the past.' },
          { type: 'arabic', content: 'في عملية الـ Consistent Cut، إذا كان استلام الرسالة في الماضي، فلازم يكون إرسالها أيضاً في الماضي. (مفيش مشكلة لو الرسالة اتبعتت في الماضي وتُستلم في المستقبل – دا بيمثل رسالة قيد النقل حالياً).' },
          { type: 'text', content: 'Inconsistent Cut (Invalid Global State)\nA cut is inconsistent if it contains an effect (the receipt of a message) in its past but excludes the cause (the sending of that message), placing the send event in the future.' },
          { type: 'arabic', content: 'لو شوفت سهم رسالة بيعبر خط القطع للخلف – جاي من المستقبل (الجانب اليمين) ورايح للماضي (الجانب الشمال) – يبقى القطع يكون Inconsistent على طول لأنه كده بيسجل حدوث شيء بدون وجود سبب ليه.' },
          { type: 'visual', id: 'cuts' }
        ]
      }
    ]
  },
  {
    id: 'Chapter 4',
    title: 'RPC & Message Queuing System',
    audioUrl: '/audio/chapter4.m4a',
    topics: [
      {
        title: 'Remote Procedure Call (RPC)',
        blocks: [
          { type: 'text', content: 'Allows an application on one machine to call a function or procedure on a remote machine transparently.' },
          { type: 'visual', id: 'rpc' },
          { type: 'text', content: 'Steps' },
          {
            type: 'bullet_list', items: [
              { text: '1. Client Stub: Client calls a local function (Stub), that marshals (packs) parameters into a message.' },
              { text: '2. Client OS sends the message to the server OS across the network.' },
              { text: '3. Server Stub: Takes the message from OS & unmarshalls it.' },
              { text: '4. Server Process: Server stub process, pack, & send back the message in same process in reverse order.' }
            ]
          },
          { type: 'text', content: 'Challenges' },
          {
            type: 'bullet_list', items: [
              {
                text: 'Heterogeneity (Endianness): Machines store bytes differently.', subItems: [
                  'o Big-endian: Stores most significant byte first.',
                  'o Little-endian: Stores last significant byte first.'
                ]
              }
            ]
          },
          { type: 'visual', id: 'endian' },
          {
            type: 'bullet_list', items: [
              { text: 'Parameter Passing: Distributed system usually relies on "copy (in/out)" semantics. Passing global variables/memory references doesn\'t work across networks.' }
            ]
          },
          { type: 'text', content: 'Variants' },
          {
            type: 'bullet_list', items: [
              { text: 'Sync RPC: Client waits for full execution.' },
              { text: 'Async RPC: Client waits only for "acceptance" ACK (Acknowledgement) and can continue its work.' },
              { text: 'Deferred Sync RPC (Callbacks): Client send async, when server finish, it triggers a callback function on the client.' },
              { text: 'Multicast RPC: Send RPC to a group of servers simultaneously.' }
            ]
          }
        ]
      },
      {
        title: 'Message-Queuing System & Broker',
        blocks: [
          { type: 'text', content: 'Message-Queuing Middleware (MOM)\nThis system is designed to provide high-level, persistent asynchronous communication, by handling transmissions of messages without requiring the sender/receiver to be connected at the same time.' },
          {
            type: 'bullet_list', items: [
              { text: 'Intermediate Storage: The system offers intermediate storage capacity for messages.' },
              { text: 'Queue Mechanics: Applications communicate by inserting messages into specific queues. Typically, each application has its own private queue to receive messages from other applications, though it is also possible for multiple applications to share a single queue.' },
              { text: 'Routing & Delivery: Messages are forwarded over a series of communication servers and are eventually delivered to their destination, even if the destination application was down when the message was originally sent.' },
              { text: 'Queue Managers: Queues are managed by entities called queue managers. An application can only place messages into, or extract messages from, a local queue. Therefore, the queue managers are responsible for taking a message and routing it across the network to the correct destination queue manager.' },
              { text: 'To interact with these queues, systems typically provide specific operations: (put, get, poll, notify).' }
            ]
          },
          { type: 'arabic', content: 'دا نظام اتصمم عشان يدعم الاتصالات الغير متزامنة والمستمرة عشان يسمح بإرسال رسايل من جهاز لجهاز تاني ومش شرط يكونو متصلين في نفس الوقت، ممكن يكون واحد منهم فاصل أو المرسل يبعت رسالة بعدين يفصل ويكون المستقبل فاصل كمان فا النظام دا يضمن أن الرسالة متضيعش لحد ما المستقبل يفتح تاني عشان يستقبل الرسالة.\n• في مساحة تخزين موجودة بتبقى وسيط بين الجهازين عشان الرسالة تتحفظ فيه مؤقتاً لحد ما تتبعت للمستقبل.\n• بتتواصل التطبيقات مع بعضها بنظام الطوابير يعني الرسايل بتتحط في Queue وتتبعت، وبيتم إدارة الطوابير دي بواسطة الـ Queue Managers والمرسل ميقدرش يحط رسالته إلا في طابور محلي Source Queue.\n• كل رسالة بيبقى فيها عنوان بيحدد طابور الوجهة بتاعتها Destination Queue.' },
          { type: 'text', content: 'Message Brokers\nMessage Broker used to translate data formats between applications in different integrated systems to understand each other.' },
          {
            type: 'bullet_list', items: [
              { text: 'Enterprise Application Integration (EAI): Brokers are highly common in advanced (EAI). In this setting, rather than converting message formats only, the broker is responsible for matching applications based on the messages that are being exchanged.' }
            ]
          },
          { type: 'text', content: 'Publish/Subscribe Model' },
          {
            type: 'bullet_list', items: [
              { text: 'Publishing: Applications send messages in the form of "publishing" directly to the broker. For example, they may publish a message under a specific category, like "topic X".' },
              { text: 'Subscribing: Other applications state their interest in "topic X" by subscribing to those messages.' },
              { text: 'Delivery: The broker then ensures that the applications who have subscribed to "topic X" will receive those specific published messages.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'Chapter 5',
    title: 'Algorithms for Shared Resources',
    audioUrl: '/audio/chapter5.m4a',
    topics: [
      {
        title: 'Algorithms for Shared Resources',
        blocks: [
          { type: 'text', content: 'Mutual Exclusion: Technique used to coordinate execution & allow only one process to get in Critical Section (CS) & use the shared resources at a time.' },
          { type: 'text', content: 'Election Algorithm: When a system relies on a coordinator & that coordinator fails, the remaining nodes must elect a new one to restore functionality.' }
        ]
      },
      {
        title: '1. Centralized Algorithm',
        blocks: [
          { type: 'text', content: '(Mutual Exclusion)\nHimics a single-processor system, by appointing one process to be coordinator.' },
          { type: 'text', content: 'How It Works' },
          {
            type: 'bullet_list', items: [
              { text: 'Process sends Request to Coordinator & waits for accept.' },
              { text: 'If resource is free, coordinator sends Grant message.' },
              { text: 'If not, coordinator queues this request in FIFO & doesn\'t reply until current process sends a release message.' }
            ]
          },
          { type: 'text', content: 'Pros' },
          {
            type: 'bullet_list', items: [
              { text: 'Fairness, Simplicity, Efficiency, and No Starvation.' }
            ]
          },
          { type: 'text', content: 'Cons' },
          {
            type: 'bullet_list', items: [
              { text: 'Single point of failure, Ambiguity; process gets NO reply if (coordinator is dead / access denied / is waiting).' }
            ]
          }
        ]
      },
      {
        title: '2. Token Ring Algorithm',
        blocks: [
          { type: 'text', content: '(Mutual Exclusion)' },
          { type: 'text', content: 'How It Works' },
          {
            type: 'bullet_list', items: [
              { text: 'Process enters CS only if it has the token.' },
              { text: 'If it doesn\'t need resources, it passes the token to next neighbor.' }
            ]
          },
          { type: 'text', content: 'Pros' },
          {
            type: 'bullet_list', items: [
              { text: 'Guaranteed Mutual Exclusion: only one token exists, only one process enters CS at a time.' },
              { text: 'No Starvation: Token circulates in well-defined order.' }
            ]
          },
          { type: 'text', content: 'Cons' },
          {
            type: 'bullet_list', items: [
              { text: 'Lost Token: Difficult to know if the token lost & another one must be generated.' },
              { text: 'Lack of FIFO: Doesn\'t guarantee requests are serviced in order.' },
              { text: 'Process Crash: If process crashes, ring is broken.' }
            ]
          },
          { type: 'text', content: '(Election)\nHow It Works' },
          {
            type: 'bullet_list', items: [
              { text: '1. Trigger: Process notices the coordinator is down.' },
              { text: '2. Election Message: It starts an election message, puts its ID inside, & passes it to next active neighbor.' },
              { text: '3. Circulation: As message travels, every active process appends its ID.' },
              { text: '4. Selection: The process assigns the one with the highest ID as a coordinator.' },
              { text: '5. Announcement: A new "coordinator message" is sent around the ring, so all processes update their records.' }
            ]
          }
        ]
      },
      {
        title: '3. Distributed Algorithm (Ricart & Agrawala Algorithms)',
        blocks: [
          { type: 'text', content: '(Mutual Exclusion)' },
          { type: 'text', content: 'How It Works' },
          {
            type: 'bullet_list', items: [
              { text: 'When a process wants to enter CS, it broadcasts a request (Containing it ID & Timestamp) to all other processes.' },
              { text: 'It can only enter CS after receiving an "OK" reply from every single process.' },
              { text: 'If two processes request at the same time, the one with earlier timestamp Wins.' }
            ]
          },
          { type: 'text', content: 'Pros' },
          {
            type: 'bullet_list', items: [
              { text: 'No Deadlock/Starvation: Mutual exclusion achieved completely democratically.' },
              { text: 'No Single Dictator' }
            ]
          },
          { type: 'text', content: 'Cons' },
          {
            type: 'bullet_list', items: [
              { text: 'N Points of Failure: (This is critical flow). If process crashes, it fails to respond, which causes forever waiting.' },
              { text: 'Vulnerability: The system is N times more likely to fail than centralized algorithm.' },
              { text: 'Heavy Traffic: Requires 2(n − 1) messages per entry/exit, making it slower, more expensive, & less robust.' }
            ]
          }
        ]
      }
    ]
  }
];
