export const PDF_CONTENT = `
High-Performance Distributed Computing Systems (Types of Architectures)
1. Cluster Computing
Consists of a group of high-end systems connected through a Local Area Network (LAN).
• Homogeneous: Clusters have near-identical hardware running the same OS.
• Uses a single managing node (Master Node) that:
o Handles allocation of nodes to parallel programs.
o Maintains a batch queue of submitted jobs.
o Provides a User Interface (UI).
Compute Nodes
They are processing units running a standard OS extended with middleware to handle communication, storage, & reliability.
Compute Nodes: Standard OS + Middleware (Communication + storage + Fault Tolerance)

2. Grid Computing
Connecting a massive number of nodes from various locations.
• Heterogeneous: Systems are composed of several types of hardware & Software and dispersed across multiple organizations.
• Scale: Can easily span across a Wide-Area Network (WAN).
• Architecture Layers:
1. Fabric: Provides an interface to local resources.
2. Connectivity: Handles communication, transaction, & authentication protocols.
3. Resource: Manages a single resource, such as creating a process/reading data.
4. Collective: Handles access to multiple resources simultaneously.
5. Application: Contains the actual grid applications in a single organization.

3. Cloud Computing
An internet-based, service-oriented model structured as a stack of distinct layers.
• Hardware Layer (Data Centers): Lowest layer, customers don’t see.
• Infrastructure Layer (IaaS): Deploys virtualization to provide customers with virtual storage & computing resources.
Example: Amazon S3, Amazon EC2
• Platform Layer (PaaS): Provides higher-level abstractions & easy ways to develop & deploy apps in the cloud.
Example: Microsoft Azure, Google App Engine
• Application Layer (SaaS): Consists of actual end-user applications.
Example: Office Suits, Google Docs, Gmail, YouTube

1. Layered Architecture
Each layer provides services to the layer above it & requests services from the layer below it.
*In this architecture, components are organized hierarchically & communication only happens between adjacent layers, ensuring clean separation of concerns.
في هذا التصميم، يتم تنظيم المكونات بشكل هرمي ولا يحدث الاتصال إلا بين الطبقات المتجاورة، مما يضمن فصلا ً واضحا للمخاوف.
• Control Flow: Downcalls/Upcalls.
• Use Cases: Network Protocols.
Three-Tier:
1. User Interface (Presentation Layer): Displays data & handles user interaction.
2. Processing Level (Business Logic Layer): Executes actual application algorithms, validation rules, & data processing.
3. Data Level (Persistence Layer): The database or file system housing the actual records.

2. Event-Based Architecture (Publish Subscribe)
Instead of components calling each other directly (synchronous), they communicate asynchronously by producing and consuming events.
The Publish-Subscribe (Pub/Sub) Model
• Publisher: An entity that generates an event notification when something noteworthy happens (e.g., "User Created", "Payment Processed").
It doesn’t know who will receive that event, or even if anyone is listening at all.
• Subscriber: An entity that registers its interest in specific event types with the event broker.

3. Middleware Architecture
Acts as an abstraction layer between the OS and distributed apps, masking the underlying network complexity.
A. Wrapper (Adapter)
Used to integrate legacy software into a distributed system by translating incompatible interfaces.
• 1-on-1: Every app gets a specific wrapper. [Complexity: O(n^2)]
• Central Broker: Centralized wrapper management. [Complexity: O(n)]
B. Interceptor
A software construct that breaks the normal execution flow of the middleware, allowing developers to inject custom application-specific code to execute.
• Request-Level Interceptors: Act as middlemen for high-level function calls, managing application-specific tasks like transparently replicating requests to backup servers.
• Message-Level Interceptors: Operate at the lower transport tier, handling raw, serialized network data streams to perform network-focused tasks like payload fragmentation, compression, or encryption without knowing the underlying application methods.

Logical Time & The Relation Between Two Events
Why Logical Time? In a Distributed System, it’s impossible to synchronize physical clocks across all machines.

The Happened-Before Relation (→)
b حصل قبل a دا معناه أن الحدث: (a -> b)
في ثلاث شروط لازم تتحقق عشان نقدر نقول: (a -> b)
1. قاعدة نفس العملية: الحدثين a و b ضمن نفس العملية والحدث a حصل قبل b، فإن a -> b
2. قاعدة الرسائل: إذا كان a هو حدث إرسال رسالة من قبل عملية ما، وكان b هو حدث استلام نفس الرسالة من قبل عملية أخرى، فإن a -> b
3. قاعدة التعدي: إذا كان a -> b و b -> c ، فإن a -> c

1. Same Process Rule: If a and b are events within the same process, and a occurs before b, then a → b.
2. Message Rule: If a is the event of sending a message by one process, and b is the event of receiving that same message by another process, then a → b.
3. Transitive Rule: If a → b and b → c, then a → c.

Concurrent Events ( ∥ )
If two distinct events x and y occur in different processes, and neither casually leads to the other (meaning x ↛ y and y ↛ x), the events are concurrent (x ∥ y).

Scalar Clocks vs. Vector Clocks
• Scalar Clocks (Lamport Clocks): Represent first attempt of translating "Happened Before" logic into actual computer code using simple increasing integer counter.
Every process keeps its own single counter (Ci), which acts as its local logical clock.
o Rule 1 (Internal Event): Before any execution, process tick its clock by one (Ci = Ci + 1)
o Rule 2 (Receiving a Message): When process receives a message with timestamp tm, it updates by (Ci = max(Ci, tm) + 1).
Limitations: (No Strong Consistency): If C(a) < C(b), we can't guarantee that a → b. They might be concurrent events.
الـ Scalar Clocks دي طريقة قديمة بتاعت واحد اسمه Lamport فكرتها الأساسية كل جهاز (Process) في السستم بيمشي وفي جيبه عداد رقمي صحيح (Integer Counter) بيبدأ من الصفر.
قوانين الحركة والزيادة:
• حدث داخلي: أول ما الجهاز يعمل أي حاجة جواه (زي تعديل بيانات)، يروح مزود عداده +1.
• إرسال رسالة: وهو بيبعت رسالة لجهاز تاني، بيلزق عليها قيمة عداده الحالي.
• استقبال رسالة: الجهاز اللي بيستقبل بيبص على الساعة اللي جاية مع الرسالة، ويقارنها بساعته المحلية، وياخد الرقم الكبير فيهم ويقفل عليه ويزود +1.
العيب القاتل (فخ الامتحان): الساعة دي بتمشي في اتجاه واحد بس. يعني لو حدث a سبب في حدوث b، فأكيد ساعة a هتكون أصغر من b. لكن العكس مش صحيح! لو لقيت ساعتين واحدة أصغر من التانية، ما تقدرش تحلف إنهم سبب في بعض، ممكن يكونوا حصلوا في نفس الوقت (Concurrent) والساعة مش قادرة تلمح ده.

• Vector Clocks: Instead of maintaining one single integer, each process keeps a vector representing its current knowledge of the logical time at all processes in entire system, such: [2, 0, 0].
o Rule 1 (Internal Event): Process marks its slot in the vector.
o Rule 2 (Receiving a Message): When receiving a message carrying a vector timestamp, the process merges its current knowledge with the incoming knowledge.
Advantage: Strong Consistency (Isomorphism) a → b ⇔ VC(a) < VC(b).
Note: If neither vector is less than another ([2, 1, 0], [1, 2, 0]), we know that events concurrent (a ∥ b).

Global States & Cuts (Consistent vs. Inconsistent)
Global State: Represents a distributed "snapshot" composed of the individual local states of all processes + the messages currently in transit along communication channels.
Cut: is a visual line drawn across a distributed execution diagram that divides all events into two sets: the Past (events occurring before the cut line) and the Future (events occurring after the cut line).

Consistent Cut (Valid Global State)
A cut is consistent if, for every event included in the cut's past, all other events that casually happened-before it are also included in the past.
في عملية الـ Consistent Cut، إذا كان استلام الرسالة في الماضي، فلازم يكون إرسالها أيضاً في الماضي. (مفيش مشكلة لو الرسالة اتبعتت في الماضي وتُستلم في المستقبل – فا دا بيمثل رسالة قيد النقل حالياً).
Inconsistent Cut (Invalid Global State)
A cut is inconsistent if it contains an effect (the receipt of a message) in its past but excludes the cause (the sending of that message), placing the send event in the future.
لو شوفت سهم رسالة بيعبر خط القطع للخلف – جاي من المستقبل (الجانب اليمين) ورايح للماضي (الجانب الشمال) – يبقى القطع يكون Inconsistent على طول لأنه كده بيسجل حدوث شيء بدون وجود سبب ليه.

Remote Procedure Call (RPC)
Allows an application on one machine to call a function or procedure on a remote machine transparently.
Steps
1. Client Stub: Client calls a local function (Stub), that marshals (packs) parameters into a message.
2. Client OS sends the message to the server OS across the network.
3. Server Stub: Takes the message from OS & unmarshalls it.
4. Server Process: Server stub process, pack, & send back the message in same process in reverse order.

Challenges
• Heterogeneity (Endianness): Machines store bytes differently.
o Big-endian: Stores most significant byte first.
o Little-endian: Stores last significant byte first.
• Parameter Passing: Distributed system usually relies on "copy (in/out)" semantics. Passing global variables/memory references doesn't work across networks.

Variants
• Sync RPC: Client waits for full execution.
• Async RPC: Client waits only for "acceptance" ACK (Acknowledgement) and can continue its work.
• Deferred Sync RPC (Callbacks): Client send async, when server finish, it triggers a callback function on the client.
• Multicast RPC: Send RPC to a group of servers simultaneously.

Message-Queuing System & Broker
Message-Queuing Middleware (MOM)
This system is designed to provide high-level, persistent asynchronous communication, by handling transmissions of messages without requiring the sender/receiver to be connected at the same time.
• Intermediate Storage: The system offers intermediate storage capacity for messages.
• Queue Mechanics: Applications communicate by inserting messages into specific queues. Typically, each application has its own private queue to receive messages from other applications, though it is also possible for multiple applications to share a single queue.
• Routing & Delivery: Messages are forwarded over a series of communication servers and are eventually delivered to their destination, even if the destination application was down when the message was originally sent.
• Queue Managers: Queues are managed by entities called queue managers. An application can only place messages into, or extract messages from, a local queue. Therefore, the queue managers are responsible for taking a message and routing it across the network to the correct destination queue manager.
• To interact with these queues, systems typically provide specific operations: (put, get, poll, notify).
دا نظام اتصمم عشان يدعم الاتصالات الغير متزامنة والمستمرة عشان يسمح بإرسال رسايل من جهاز لجهاز تاني ومش شرط يكونو متصلين في نفس الوقت، ممكن يكون واحد منهم فاصل أو المرسل يبعت رسالة بعدين يفصل ويكون المستقبل فاصل كمان فا النظام دا يضمن أن الرسالة متضيعش لحد ما المستقبل يفتح تاني عشان يستقبل الرسالة.
• في مساحة تخزين موجودة بتبقى وسيط بين الجهازين عشان الرسالة تتحفظ فيه مؤقتاً لحد ما تتبعت للمستقبل.
• بتتواصل التطبيقات مع بعضها بنظام الطوابير يعني الرسايل بتتحط في Queue وتتبعت، وبيتم إدارة الطوابير دي بواسطة الـ Queue Managers والمرسل ميقدرش يحط رسالته إلا في طابور محلي Source Queue.
• كل رسالة بيبقى فيها عنوان بيحدد طابور الوجهة بتاعتها Destination Queue.

Message Brokers
Message Broker used to translate data formats between applications in different integrated systems to understand each other.
• Enterprise Application Integration (EAI): Brokers are highly common in advanced (EAI). In this setting, rather than converting message formats only, the broker is responsible for matching applications based on the messages that are being exchanged.
Publish/Subscribe Model
• Publishing: Applications send messages in the form of "publishing" directly to the broker. For example, they may publish a message under a specific category, like "topic X".
• Subscribing: Other applications state their interest in "topic X" by subscribing to those messages.
• Delivery: The broker then ensures that the applications who have subscribed to "topic X" will receive those specific published messages.

Algorithms for Shared Resources
Mutual Exclusion: Technique used to coordinate execution & allow only one process to get in Critical Section (CS) & use the shared resources at a time.
Election Algorithm: When a system relies on a coordinator & that coordinator fails, the remaining nodes must elect a new one to restore functionality.

1. Centralized Algorithm
(Mutual Exclusion)
Mimics a single-processor system, by appointing one process to be coordinator.
How It Works
• Process sends Request to Coordinator & waits for accept.
• If resource is free, coordinator sends Grant message.
• If not, coordinator queues this request in FIFO & doesn't reply until current process sends a release message.
Pros
• Fairness, Simplicity, Efficiency, and No Starvation.
Cons
• Single point of failure, Ambiguity; process gets NO reply if (coordinator is dead / access denied / is waiting).

2. Token Ring Algorithm
(Mutual Exclusion)
How It Works
• Process enters CS only if it has the token.
• If it doesn't need resources, it passes the token to next neighbor.
Pros
• Guaranteed Mutual Exclusion: only one token exists, only one process enters CS at a time.
• No Starvation: Token circulates in well-defined order.
Cons
• Lost Token: Difficult to know if the token lost & another one must be generated.
• Lack of FIFO: Doesn't guarantee requests are serviced in order.
• Process Crash: If process crashes, ring is broken.

(Election)
How It Works
1. Trigger: Process notices the coordinator is down.
2. Election Message: It starts an election message, puts its ID inside, & passes it to next active neighbor.
3. Circulation: As message travels, every active process appends its ID.
4. Selection: The process assigns the one with the highest ID as a coordinator.
5. Announcement: A new "coordinator message" is sent around the ring, so all processes update their records.

3. Distributed Algorithm (Ricart & Agrawala Algorithms)
(Mutual Exclusion)
How It Works
• When a process wants to enter CS, it broadcasts a request (Containing it ID & Timestamp) to all other processes.
• It can only enter CS after receiving an "OK" reply from every single process.
• If two processes request at the same time, the one with earlier timestamp Wins.
Pros
• No Deadlock/Starvation: Mutual exclusion achieved completely democratically.
• No Single Dictator
Cons
• N Points of Failure: (This is critical flow). If process crashes, it fails to respond, which causes forever waiting.
• Vulnerability: The system is N times more likely to fail than centralized algorithm.
• Heavy Traffic: Requires 2(n − 1) messages per entry/exit, making it slower, more expensive, & less robust.
`;
